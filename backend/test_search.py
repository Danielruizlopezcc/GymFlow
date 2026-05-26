import httpx, os
key = os.environ["RAPIDAPI_KEY"]
h = {"X-RapidAPI-Key": key, "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"}

tests = [
    "dumbbell incline",
    "incline press",
    "incline fly",
    "fly machine",
    "chest fly",
    "butterfly",
    "kneeling crunch",
    "rollout",
    "rear foot elevated",
    "rear leg elevated",
    "standing dumbbell calf",
    "single leg calf",
    "rope face",
    "dumbbell single arm row",
    "face",
    "wide grip pulldown",
]

for term in tests:
    r = httpx.get(
        f"https://exercisedb.p.rapidapi.com/exercises/name/{term}",
        headers=h,
        params={"limit": 2}
    )
    data = r.json()
    if isinstance(data, list) and data:
        names = [f"{e['name']} (id={e['id']})" for e in data[:2]]
        print(f"  {term!r:38} -> {names}")
    else:
        print(f"  {term!r:38} -> SIN RESULTADOS")
