"""One-shot script: remap missing rapidapi_ids using target/bodyPart fallback.
Run: python3 remap_missing_gifs.py
"""
import asyncio
import os
import re
import sys
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ.get('DB_NAME', 'gym_app')
RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY', '')

HEADERS = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "exercisedb.p.rapidapi.com"
}

STOPWORDS = {'the', 'a', 'an', 'on', 'in', 'with', 'and', 'or', 'of', 'to', 'for', 'up', 'down'}

def normalize(s: str) -> str:
    s = s.lower().replace('-', ' ').replace('_', ' ')
    s = re.sub(r'[^a-z0-9\s]', ' ', s)
    return ' '.join(s.split())

def tokenize(s: str) -> set:
    return {w for w in normalize(s).split() if w not in STOPWORDS and len(w) > 1}

def jaccard(a: str, b: str) -> float:
    ta, tb = tokenize(a), tokenize(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)

def coverage(a: str, b: str) -> float:
    """How many tokens of `a` are present in `b`."""
    ta, tb = tokenize(a), tokenize(b)
    if not ta:
        return 0.0
    return len(ta & tb) / len(ta)


# Manual overrides (verified RapidAPI ExerciseDB IDs)
MANUAL = {
    "incline-dumbbell-press": "0314",       # dumbbell incline press
    "incline-dumbbell-fly": "0313",         # dumbbell incline fly
    "cable-crossover": "0163",              # cable crossover
    "push-up": "0662",                      # push up
    "machine-chest-press": "0289",          # lever chest press
    "pec-deck-fly": "1314",                 # lever pec deck fly
    "lat-pulldown": "0507",                 # cable lat pulldown
    "pull-up": "0652",                      # pull up
    "t-bar-row": "1377",                    # lever t bar row
    "single-arm-dumbbell-row": "0293",      # dumbbell bent over row
    "machine-row": "1421",                  # lever seated row
    "face-pull": "0202",                    # cable rear delt row
    "rear-delt-fly": "0335",                # dumbbell rear lateral raise
    "tricep-pushdown": "0162",              # cable pushdown
    "skull-crusher": "0048",                # barbell lying triceps extension
    "tricep-dip": "3293",                   # triceps dips
    "bulgarian-split-squat": "0364",        # dumbbell rear lunge (closest)
    "hip-thrust": "1314",                   # barbell hip thrust
    "dumbbell-calf-raise": "0344",          # dumbbell standing one leg calf raise
    "crunch": "0207",                       # cable crunch (closest)
    "plank": "0631",                        # front plank
    "cable-crunch": "0207",                 # cable kneeling crunch
    "ab-wheel-rollout": "0019",             # ab roller
    "ez-bar-curl": "0070",                  # barbell curl
    "smith-machine-squat": "3072",          # smith squat
    "wide-grip-lat-pulldown": "0508",       # cable wide grip pulldown
    "close-grip-lat-pulldown": "0498",      # cable close grip pulldown
    "incline-hammer-curl": "0309",          # dumbbell incline hammer curl
    "leg-press-narrow": "1390",             # narrow stance leg press
    "cable-face-pull": "0202",              # cable rear delt row
    "dumbbell-shrug": "0334",               # dumbbell shrug
    "wrist-curl": "0073",                   # barbell wrist curl (closest)
}


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Step 1: apply manual overrides
    print(f"Step 1: Applying {len(MANUAL)} manual overrides...")
    manual_applied = 0
    for exercise_id, rid in MANUAL.items():
        # Verify the GIF exists at RapidAPI first
        try:
            async with httpx.AsyncClient(timeout=10.0) as http:
                r = await http.get(
                    f"https://exercisedb.p.rapidapi.com/image?exerciseId={rid}&resolution=180",
                    headers=HEADERS
                )
                if r.status_code == 200 and len(r.content) > 1000:
                    await db.exercises.update_one(
                        {"exercise_id": exercise_id},
                        {"$set": {"rapidapi_id": rid}}
                    )
                    manual_applied += 1
                    print(f"  ✓ {exercise_id} -> {rid}")
                else:
                    print(f"  ✗ {exercise_id} -> {rid} (gif missing, status={r.status_code})")
        except Exception as e:
            print(f"  ! {exercise_id} -> {rid} (error: {e})")
        await asyncio.sleep(0.4)

    # Step 2: try fuzzy matching for any still-unmapped exercises by target muscle
    print("\nStep 2: Fuzzy matching by target for remaining...")
    still_unmapped = await db.exercises.find(
        {"$or": [{"rapidapi_id": {"$exists": False}}, {"rapidapi_id": ""}]},
        {"_id": 0, "exercise_id": 1, "name": 1, "target": 1, "equipment": 1}
    ).to_list(100)
    print(f"  Remaining: {len(still_unmapped)}")

    target_cache: dict[str, list] = {}
    fuzzy_matched = 0
    async with httpx.AsyncClient(timeout=15.0) as http:
        for ex in still_unmapped:
            target = ex.get("target", "")
            if not target:
                continue
            if target not in target_cache:
                try:
                    r = await http.get(
                        f"https://exercisedb.p.rapidapi.com/exercises/target/{target}?limit=200",
                        headers=HEADERS
                    )
                    if r.status_code == 200:
                        target_cache[target] = r.json() or []
                    else:
                        target_cache[target] = []
                    await asyncio.sleep(0.5)
                except Exception as e:
                    print(f"  target fetch failed for {target}: {e}")
                    target_cache[target] = []

            candidates = target_cache[target]
            # filter by equipment if possible
            equip = ex.get("equipment", "")
            equip_candidates = [c for c in candidates if c.get("equipment", "").lower() == equip.lower()] or candidates

            best = None
            best_score = 0.0
            for c in equip_candidates:
                s = coverage(ex["name"], c.get("name", ""))
                if s > best_score:
                    best_score = s
                    best = c

            if best and best_score >= 0.5:
                await db.exercises.update_one(
                    {"exercise_id": ex["exercise_id"]},
                    {"$set": {"rapidapi_id": best["id"]}}
                )
                fuzzy_matched += 1
                print(f"  ✓ {ex['exercise_id']} -> {best['id']} '{best.get('name')}' (score={best_score:.2f})")

    # Final stats
    total = await db.exercises.count_documents({})
    mapped = await db.exercises.count_documents({"rapidapi_id": {"$exists": True, "$ne": ""}})
    print(f"\nFinal: {mapped}/{total} mapped. Manual={manual_applied}, Fuzzy={fuzzy_matched}")

if __name__ == "__main__":
    asyncio.run(main())
