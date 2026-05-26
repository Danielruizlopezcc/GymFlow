#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sync_gifs.py - Descarga imagenes faltantes de ExerciseDB y sube todo a Supabase.
"""
import os
import sys
import time
import httpx
from pathlib import Path
from supabase import create_client

SUPABASE_URL     = os.environ["SUPABASE_URL"]
SUPABASE_SVC_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
RAPIDAPI_KEY     = os.environ["RAPIDAPI_KEY"]
GIF_DIR          = Path(__file__).parent / "gif_cache"

RAPIDAPI_HOST = "exercisedb.p.rapidapi.com"
HEADERS = {
    "X-RapidAPI-Key":  RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
}

# Ejercicios faltantes: exercise_id -> ID exacto en ExerciseDB
# (IDs verificados con la API)
MISSING_IDS = {
    'incline-dumbbell-press':   '0314',   # dumbbell incline bench press
    'incline-dumbbell-fly':     '0171',   # cable incline fly
    'cable-crossover':          '1269',   # cable standing up straight crossovers
    'pec-deck-fly':             '0576',   # lever chest press (mejor disponible)
    'single-arm-dumbbell-row':  '0541',   # kettlebell one arm row
    'face-pull':                '0076',   # barbell rear delt row
    'wide-grip-lat-pulldown':   '0818',   # twin handle parallel grip lat pulldown
    'close-grip-lat-pulldown':  '0015',   # assisted parallel close grip pull-up
    'rear-delt-fly':            '0075',   # barbell rear delt raise
    'cable-face-pull':          '0180',   # cable low seated row (similar)
    'ez-bar-curl':              '0446',   # ez barbell close-grip curl
    'bulgarian-split-squat':    '0097',   # barbell side split squat
    'dumbbell-calf-raise':      '0409',   # dumbbell single leg calf raise
    'cable-crunch':             '0175',   # cable kneeling crunch
    'ab-wheel-rollout':         '0857',   # wheel rollout
}


def download_missing():
    print("\n" + "-"*55)
    print("PASO 1 - Descargando imagenes faltantes de ExerciseDB")
    print("-"*55)

    ok   = 0
    fail = 0

    with httpx.Client(timeout=30) as client:
        for exercise_id, db_id in MISSING_IDS.items():
            dest = GIF_DIR / f"{exercise_id}.gif"
            if dest.exists():
                print(f"  SKIP  {exercise_id} (ya existe)")
                ok += 1
                continue

            try:
                img_r = client.get(
                    f"https://{RAPIDAPI_HOST}/image",
                    headers=HEADERS,
                    params={"exerciseId": db_id, "resolution": "360"},
                    follow_redirects=True,
                )
                img_r.raise_for_status()
                dest.write_bytes(img_r.content)
                kb = len(img_r.content) // 1024
                ct = img_r.headers.get("content-type", "?")
                print(f"  OK    {exercise_id} ({kb} KB, {ct}, db_id={db_id})")
                ok += 1
            except Exception as e:
                print(f"  FAIL  {exercise_id} (db_id={db_id}): {e}")
                fail += 1

            time.sleep(0.3)

    print(f"\n  Descarga: {ok} OK, {fail} fallidos\n")
    return fail == 0


def upload_all():
    print("\n" + "-"*55)
    print("PASO 2 - Subiendo todos los archivos a Supabase Storage")
    print("-"*55)

    sb   = create_client(SUPABASE_URL, SUPABASE_SVC_KEY)
    imgs = sorted(GIF_DIR.glob("*.gif"))
    print(f"  Total de archivos a subir: {len(imgs)}")

    ok   = 0
    fail = 0

    for img_path in imgs:
        dest = img_path.name
        data = img_path.read_bytes()
        if data[:4] == b'\x89PNG':
            ct = "image/png"
        elif data[:6] in (b'GIF87a', b'GIF89a'):
            ct = "image/gif"
        else:
            ct = "image/gif"

        try:
            sb.storage.from_("exercise-gifs").upload(
                path=dest,
                file=data,
                file_options={"content-type": ct, "upsert": "true"},
            )
            print(f"  OK    {dest}")
            ok += 1
        except Exception as e:
            print(f"  FAIL  {dest}: {e}")
            fail += 1

    print(f"\n  Subida: {ok} subidos, {fail} fallidos")
    return fail == 0


if __name__ == "__main__":
    GIF_DIR.mkdir(exist_ok=True)
    step1 = download_missing()
    step2 = upload_all()

    print("\n" + "="*55)
    if step1 and step2:
        print("  OK - Todo completado sin errores.")
    else:
        print("  AVISO - Completado con algunos fallos (ver arriba).")
    print("="*55 + "\n")
