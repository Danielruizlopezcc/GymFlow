from fastapi import FastAPI, APIRouter, Header
from fastapi.responses import JSONResponse, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import asyncio
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

from exercises_data import EXERCISES

ROOT_DIR = Path(__file__).parent
GIF_CACHE_DIR = ROOT_DIR / "gif_cache"
GIF_CACHE_DIR.mkdir(exist_ok=True)

load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY', '')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'gym_app')]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ─── Logging ───
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ─── Models ───
class SessionRequest(BaseModel):
    session_id: str

class WorkoutExerciseModel(BaseModel):
    exercise_id: str
    name: str
    sets: int = 3
    reps: str = "10"
    weight: Optional[float] = None
    notes: str = ""

class WorkoutCreate(BaseModel):
    date: str
    name: str
    exercises: List[WorkoutExerciseModel] = []

class WorkoutUpdate(BaseModel):
    name: Optional[str] = None
    exercises: Optional[List[WorkoutExerciseModel]] = None

# ─── Auth Helper ───
async def get_current_user(authorization: Optional[str] = None):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    expires_at = session.get("expires_at")
    if expires_at:
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            await db.user_sessions.delete_one({"session_token": token})
            return None
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    return user

# ─── Auth Routes ───
@api_router.post("/auth/session")
async def create_session(req: SessionRequest):
    try:
        async with httpx.AsyncClient() as http_client:
            resp = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": req.session_id}
            )
            if resp.status_code != 200:
                return JSONResponse(status_code=401, content={"error": "Invalid session"})
            data = resp.json()

        email = data["email"]
        existing = await db.users.find_one({"email": email}, {"_id": 0})
        if existing:
            user_id = existing["user_id"]
        else:
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            user_doc = {
                "user_id": user_id,
                "email": email,
                "name": data.get("name", ""),
                "picture": data.get("picture", ""),
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(user_doc)

        session_token = data.get("session_token", str(uuid.uuid4()))
        await db.user_sessions.insert_one({
            "session_token": session_token,
            "user_id": user_id,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        })

        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return {
            "user": {
                "user_id": user["user_id"],
                "email": user["email"],
                "name": user["name"],
                "picture": user.get("picture", "")
            },
            "session_token": session_token
        }
    except Exception as e:
        logger.error(f"Auth session error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@api_router.get("/auth/me")
async def get_me(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if not user:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user["name"],
        "picture": user.get("picture", "")
    }

@api_router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        await db.user_sessions.delete_one({"session_token": token})
    return {"message": "Logged out"}

# ─── Exercise Routes ───
@api_router.get("/exercises")
async def list_exercises(
    body_part: Optional[str] = None,
    target: Optional[str] = None,
    equipment: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    skip: int = 0
):
    query = {}
    if body_part:
        query["body_part"] = body_part
    if target:
        query["target"] = target
    if equipment:
        query["equipment"] = equipment
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    exercises = await db.exercises.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    total = await db.exercises.count_documents(query)
    return {"exercises": exercises, "total": total}

@api_router.get("/exercises/body-parts")
async def get_body_parts():
    body_parts = await db.exercises.distinct("body_part")
    return {"body_parts": sorted(body_parts)}

@api_router.get("/exercises/targets")
async def get_targets():
    targets = await db.exercises.distinct("target")
    return {"targets": sorted(targets)}

@api_router.get("/exercises/equipment")
async def get_equipment_list():
    equipment = await db.exercises.distinct("equipment")
    return {"equipment": sorted(equipment)}

@api_router.get("/exercises/{exercise_id}")
async def get_exercise(exercise_id: str):
    exercise = await db.exercises.find_one({"exercise_id": exercise_id}, {"_id": 0})
    if not exercise:
        return JSONResponse(status_code=404, content={"error": "Exercise not found"})
    return exercise

@api_router.get("/exercises/{exercise_id}/similar")
async def get_similar_exercises(exercise_id: str, limit: int = 6):
    exercise = await db.exercises.find_one({"exercise_id": exercise_id}, {"_id": 0})
    if not exercise:
        return JSONResponse(status_code=404, content={"error": "Exercise not found"})

    # Priority 1: same target, different equipment
    diff_equipment = await db.exercises.find({
        "exercise_id": {"$ne": exercise_id},
        "target": exercise["target"],
        "equipment": {"$ne": exercise["equipment"]}
    }, {"_id": 0}).limit(limit).to_list(limit)

    # Priority 2: same body part
    if len(diff_equipment) < limit:
        remaining = limit - len(diff_equipment)
        existing_ids = [e["exercise_id"] for e in diff_equipment] + [exercise_id]
        same_body = await db.exercises.find({
            "exercise_id": {"$nin": existing_ids},
            "body_part": exercise["body_part"]
        }, {"_id": 0}).limit(remaining).to_list(remaining)
        diff_equipment.extend(same_body)

    return {"similar": diff_equipment}

# ─── Workout Routes ───
@api_router.post("/workouts")
async def create_workout(workout: WorkoutCreate, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if not user:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    workout_id = f"wkt_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    workout_dict = {
        "workout_id": workout_id,
        "user_id": user["user_id"],
        "date": workout.date,
        "name": workout.name,
        "exercises": [e.model_dump() for e in workout.exercises],
        "created_at": now,
        "updated_at": now
    }
    await db.workouts.insert_one(workout_dict)
    result = {k: v for k, v in workout_dict.items() if k != "_id"}
    return result

@api_router.get("/workouts")
async def list_workouts(
    date: Optional[str] = None,
    month: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    user = await get_current_user(authorization)
    if not user:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    query = {"user_id": user["user_id"]}
    if date:
        query["date"] = date
    elif month:
        query["date"] = {"$regex": f"^{month}"}
    workouts = await db.workouts.find(query, {"_id": 0}).sort("date", 1).to_list(100)
    return {"workouts": workouts}

@api_router.get("/workouts/{workout_id}")
async def get_workout(workout_id: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if not user:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    workout = await db.workouts.find_one(
        {"workout_id": workout_id, "user_id": user["user_id"]}, {"_id": 0}
    )
    if not workout:
        return JSONResponse(status_code=404, content={"error": "Workout not found"})
    return workout

@api_router.put("/workouts/{workout_id}")
async def update_workout(
    workout_id: str,
    update: WorkoutUpdate,
    authorization: Optional[str] = Header(None)
):
    user = await get_current_user(authorization)
    if not user:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    update_dict = {}
    if update.name is not None:
        update_dict["name"] = update.name
    if update.exercises is not None:
        update_dict["exercises"] = [e.model_dump() for e in update.exercises]
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.workouts.update_one(
        {"workout_id": workout_id, "user_id": user["user_id"]},
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        return JSONResponse(status_code=404, content={"error": "Workout not found"})
    workout = await db.workouts.find_one({"workout_id": workout_id}, {"_id": 0})
    return workout

@api_router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if not user:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    result = await db.workouts.delete_one(
        {"workout_id": workout_id, "user_id": user["user_id"]}
    )
    if result.deleted_count == 0:
        return JSONResponse(status_code=404, content={"error": "Workout not found"})
    return {"message": "Workout deleted"}

# GIF proxy endpoint with disk caching
@api_router.get("/exercises/{exercise_id}/gif")
async def get_exercise_gif(exercise_id: str):
    # Check disk cache first
    cache_path = GIF_CACHE_DIR / f"{exercise_id}.gif"
    if cache_path.exists():
        gif_data = cache_path.read_bytes()
        return Response(content=gif_data, media_type="image/gif",
                       headers={"Cache-Control": "public, max-age=31536000"})

    if not RAPIDAPI_KEY:
        return JSONResponse(status_code=404, content={"error": "No API key configured"})

    # Get rapidapi_id from DB
    exercise = await db.exercises.find_one({"exercise_id": exercise_id}, {"_id": 0})
    if not exercise:
        return JSONResponse(status_code=404, content={"error": "Exercise not found"})

    rapidapi_id = exercise.get("rapidapi_id", "")
    if not rapidapi_id:
        return JSONResponse(status_code=404, content={"error": "No GIF mapping available"})

    # Fetch from RapidAPI
    try:
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            resp = await http_client.get(
                f"https://exercisedb.p.rapidapi.com/image?exerciseId={rapidapi_id}&resolution=180",
                headers=RAPIDAPI_HEADERS
            )
            if resp.status_code == 200 and len(resp.content) > 100:
                cache_path.write_bytes(resp.content)
                return Response(content=resp.content, media_type="image/gif",
                               headers={"Cache-Control": "public, max-age=31536000"})
            else:
                return JSONResponse(status_code=404, content={"error": "GIF not found"})
    except Exception as e:
        logger.error(f"GIF fetch error: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to fetch GIF"})

# ─── Health ───
@api_router.get("/health")
async def health():
    return {"status": "ok", "exercises_count": await db.exercises.count_documents({})}

# ─── App Setup ───
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

import asyncio
import re

def normalize_name(name: str) -> str:
    """Normalize exercise name for matching."""
    return re.sub(r'[^a-z0-9\s]', '', name.lower().strip())

def name_similarity(name1: str, name2: str) -> float:
    """Calculate word-based similarity between two names."""
    words1 = set(normalize_name(name1).split())
    words2 = set(normalize_name(name2).split())
    if not words1 or not words2:
        return 0.0
    common = words1 & words2
    return len(common) / max(len(words1), len(words2))

RAPIDAPI_HEADERS = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "exercisedb.p.rapidapi.com"
}

async def fetch_and_map_rapidapi_ids():
    """Fetch exercises from RapidAPI by name search, match and store rapidapi_id."""
    if not RAPIDAPI_KEY:
        logger.info("No RAPIDAPI_KEY set, skipping ExerciseDB GIF mapping.")
        return

    already_mapped = await db.exercises.count_documents({"rapidapi_id": {"$exists": True, "$ne": ""}})
    if already_mapped > 40:
        logger.info(f"RapidAPI IDs already mapped for {already_mapped} exercises.")
        return

    logger.info("Mapping exercises to RapidAPI IDs via name search...")
    our_exercises = await db.exercises.find(
        {"$or": [{"rapidapi_id": {"$exists": False}}, {"rapidapi_id": ""}]},
        {"_id": 0, "exercise_id": 1, "name": 1}
    ).to_list(200)

    if not our_exercises:
        logger.info("All exercises already have RapidAPI IDs.")
        return

    matched = 0
    try:
        async with httpx.AsyncClient(timeout=15.0) as http_client:
            for i, our_ex in enumerate(our_exercises):
                search_term = our_ex["name"].lower().replace("-", " ")
                # Use key words for search (first 2-3 significant words)
                words = search_term.split()
                search_q = " ".join(words[:3]) if len(words) > 3 else search_term

                try:
                    resp = await http_client.get(
                        f"https://exercisedb.p.rapidapi.com/exercises/name/{search_q}?limit=5",
                        headers=RAPIDAPI_HEADERS
                    )
                    if resp.status_code == 200:
                        results = resp.json()
                        if results:
                            # Find best match
                            best_match = None
                            best_score = 0.0
                            for r in results:
                                score = name_similarity(our_ex["name"], r.get("name", ""))
                                if score > best_score:
                                    best_score = score
                                    best_match = r
                            if best_match and best_score >= 0.5:
                                await db.exercises.update_one(
                                    {"exercise_id": our_ex["exercise_id"]},
                                    {"$set": {"rapidapi_id": best_match["id"]}}
                                )
                                matched += 1
                                logger.debug(f"Mapped '{our_ex['name']}' -> '{best_match['name']}' (id={best_match['id']}, score={best_score:.2f})")
                except Exception as e:
                    logger.warning(f"Search failed for '{our_ex['name']}': {e}")

                # Rate limit: ~2 req/sec to stay safe
                if (i + 1) % 10 == 0:
                    logger.info(f"Mapping progress: {i+1}/{len(our_exercises)} ({matched} matched)")
                await asyncio.sleep(0.6)

    except Exception as e:
        logger.error(f"RapidAPI mapping error: {e}")

    logger.info(f"Mapped {matched}/{len(our_exercises)} exercises to RapidAPI IDs")

@app.on_event("startup")
async def startup():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id", unique=True)
    await db.user_sessions.create_index("session_token", unique=True)
    await db.user_sessions.create_index("user_id")
    await db.user_sessions.create_index("expires_at", expireAfterSeconds=0)
    await db.exercises.create_index("exercise_id", unique=True)
    await db.exercises.create_index("body_part")
    await db.exercises.create_index("target")
    await db.exercises.create_index("equipment")
    await db.exercises.create_index([("name", "text")])
    await db.workouts.create_index("user_id")
    await db.workouts.create_index("date")
    await db.workouts.create_index("workout_id", unique=True)

    # Seed exercises
    count = await db.exercises.count_documents({})
    if count == 0:
        logger.info(f"Seeding {len(EXERCISES)} exercises...")
        for ex in EXERCISES:
            try:
                await db.exercises.insert_one(dict(ex))
            except Exception as e:
                logger.warning(f"Skip duplicate: {ex['exercise_id']}: {e}")
        logger.info("Exercise seeding complete.")
    else:
        logger.info(f"Exercises already seeded: {count} exercises in DB.")

    # Fetch and map RapidAPI IDs for GIFs
    await fetch_and_map_rapidapi_ids()

@app.on_event("shutdown")
async def shutdown():
    client.close()
