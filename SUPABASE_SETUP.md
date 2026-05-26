# GymFlow — Guía de Configuración Supabase

> Sigue estos pasos **en orden** para que la app funcione completamente.

---

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**
2. Elige un nombre (ej. `gymflow`), región, contraseña fuerte
3. Espera a que el proyecto arranque (~30 s)
4. Anota (Settings → API):
   - **Project URL** → `https://<ref>.supabase.co`
   - **anon / public key**

---

## 2. Ejecutar el schema SQL

1. En el Dashboard → **SQL Editor → New query**
2. Pega el contenido de `supabase/schema.sql`
3. Haz clic en **Run**

Esto crea:
- Tabla `public.profiles` con RLS
- Tabla `public.workouts` con RLS
- Trigger que crea el perfil automáticamente al registrarse
- Bucket `exercise-gifs` en Storage

---

## 3. Configurar Google OAuth

### En Google Cloud Console
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → **Credentials → Create Credentials → OAuth 2.0 Client ID**
3. Tipo: **Web application**
4. **Authorized JavaScript origins**:
   ```
   https://<ref>.supabase.co
   https://<tu-dominio-netlify>.netlify.app
   ```
5. **Authorized redirect URIs**:
   ```
   https://<ref>.supabase.co/auth/v1/callback
   ```
6. Anota el **Client ID** y **Client Secret**

### En Supabase Dashboard
1. Authentication → **Providers → Google**
2. Activa Google y pega Client ID + Client Secret
3. Guarda

---

## 4. Configurar URLs de autenticación en Supabase

En Authentication → **URL Configuration**:

| Campo | Valor |
|-------|-------|
| Site URL | `https://<tu-dominio>.netlify.app` |
| Redirect URLs | `https://<tu-dominio>.netlify.app/**` |
| | `gymflow://**` ← para la app móvil |

---

## 5. Subir GIFs a Supabase Storage

Los GIFs ya están cacheados en `backend/gif_cache/`. Súbelos al bucket `exercise-gifs`:

### Opción A — desde el Dashboard (manual)
1. Storage → `exercise-gifs` → **Upload files**
2. Sube todos los archivos de `backend/gif_cache/*.gif`

### Opción B — con la CLI de Supabase (recomendado)
```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Subir todos los GIFs
for f in backend/gif_cache/*.gif; do
  name=$(basename "$f")
  supabase storage cp "$f" "ss://exercise-gifs/$name" --project-ref <ref>
done
```

### Opción C — con el script de Python
```bash
pip install supabase
python backend/upload_gifs.py
```
(ver script de ejemplo al final de este documento)

---

## 6. Variables de entorno para el frontend

Crea el archivo `frontend/.env.local`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu_anon_key...
```

### Para Netlify
En el Dashboard de Netlify → Site → **Environment variables**:
```
EXPO_PUBLIC_SUPABASE_URL     = https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY = eyJ...tu_anon_key...
```

---

## 7. Instalar dependencias y arrancar

```bash
cd frontend
yarn install          # instala @supabase/supabase-js
yarn web              # web local
# o
yarn start            # Expo Go para móvil
```

---

## 8. Despliegue en Netlify

El `render.yaml` ya no es necesario (backend eliminado).

En Netlify:
- **Base directory**: `frontend`
- **Build command**: `npx expo export --platform web`
- **Publish directory**: `frontend/dist`

O conecta directamente el repo a Netlify y configura:
```
Build command:   cd frontend && npx expo export --platform web
Publish dir:     frontend/dist
```

---

## Variables de entorno — resumen final

| Variable | Dónde obtenerla | Quién la usa |
|----------|----------------|--------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Frontend |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Frontend |

> **Variables eliminadas** (ya no hacen falta):
> - `EXPO_PUBLIC_BACKEND_URL`
> - `MONGO_URL`
> - `DB_NAME`
> - `RAPIDAPI_KEY`

---

## Arquitectura nueva (resumen)

```
Frontend (Expo Web + Mobile)
  ├─ Auth         → Supabase Auth (Google OAuth)
  ├─ Ejercicios   → JSON estático en el bundle (sin red)
  ├─ GIFs         → Supabase Storage (bucket exercise-gifs)
  └─ Workouts     → Supabase DB (tabla workouts, RLS por usuario)

Backend FastAPI → ELIMINADO
MongoDB         → ELIMINADO
```

---

## Script de subida de GIFs (Python)

Guarda como `backend/upload_gifs.py` y ejecuta una sola vez:

```python
#!/usr/bin/env python3
"""Sube los GIFs cacheados al bucket exercise-gifs de Supabase Storage."""
import os
from pathlib import Path
from supabase import create_client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]  # usar service role para uploads

client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
gif_dir = Path(__file__).parent / "gif_cache"

for gif_path in gif_dir.glob("*.gif"):
    with open(gif_path, "rb") as f:
        data = f.read()
    dest = gif_path.name  # ej. "barbell-bench-press.gif"
    try:
        client.storage.from_("exercise-gifs").upload(
            dest, data,
            {"content-type": "image/gif", "upsert": "true"}
        )
        print(f"✓ {dest}")
    except Exception as e:
        print(f"✗ {dest}: {e}")
```

Uso:
```bash
pip install supabase
SUPABASE_URL=https://<ref>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
python backend/upload_gifs.py
```

---

## Riesgos y cosas pendientes

| # | Riesgo | Estado |
|---|--------|--------|
| 1 | GIFs sin subir → imágenes vacías | Solucionable ejecutando el script |
| 2 | Workouts anteriores en MongoDB | Migrar manualmente si los hay (ver sección siguiente) |
| 3 | App móvil requiere scheme `gymflow` configurado | Ya actualizado en `app.json` |
| 4 | Google OAuth necesita dominio Netlify en Cloud Console | Configurar antes del primer deploy |

### Migrar workouts existentes de MongoDB

Si tienes workouts reales en la base anterior:

```python
# Script de migración (ejecutar una sola vez)
import os
from pymongo import MongoClient
from supabase import create_client

mongo = MongoClient(os.environ["MONGO_URL"])
db = mongo["gym_app"]

supa = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# Necesitas mapear email → Supabase user_id manualmente o via API
users_resp = supa.auth.admin.list_users()
email_to_id = {u.email: u.id for u in users_resp}

for w in db.workouts.find():
    email = db.users.find_one({"user_id": w["user_id"]}, {"email": 1})["email"]
    supabase_user_id = email_to_id.get(email)
    if not supabase_user_id:
        print(f"Usuario no encontrado: {email}")
        continue
    supa.table("workouts").insert({
        "user_id":   supabase_user_id,
        "date":      w["date"],
        "name":      w["name"],
        "exercises": w.get("exercises", []),
    }).execute()
    print(f"Migrado: {w['name']} ({w['date']})")
```
