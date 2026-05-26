#!/usr/bin/env python3
"""
Sube los GIFs cacheados de backend/gif_cache/ al bucket
"exercise-gifs" de Supabase Storage.

Uso:
    pip install supabase
    SUPABASE_URL=https://<ref>.supabase.co \
    SUPABASE_SERVICE_ROLE_KEY=eyJ... \
    python backend/upload_gifs.py
"""
import os
from pathlib import Path

try:
    from supabase import create_client
except ImportError:
    print("Instala primero: pip install supabase")
    raise SystemExit(1)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: Necesitas las variables SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY")
    raise SystemExit(1)

client  = create_client(SUPABASE_URL, SERVICE_KEY)
gif_dir = Path(__file__).parent / "gif_cache"

if not gif_dir.exists():
    print(f"ERROR: No existe la carpeta {gif_dir}")
    raise SystemExit(1)

gifs  = sorted(gif_dir.glob("*.gif"))
ok    = 0
fail  = 0

print(f"Subiendo {len(gifs)} GIFs a Supabase Storage (bucket: exercise-gifs)...\n")

for gif_path in gifs:
    dest = gif_path.name
    try:
        with open(gif_path, "rb") as f:
            data = f.read()
        client.storage.from_("exercise-gifs").upload(
            path=dest,
            file=data,
            file_options={"content-type": "image/gif", "upsert": "true"},
        )
        print(f"  ✓ {dest}")
        ok += 1
    except Exception as e:
        print(f"  ✗ {dest}: {e}")
        fail += 1

print(f"\nResultado: {ok} subidos, {fail} fallidos")
