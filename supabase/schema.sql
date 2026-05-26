-- =============================================================
-- GymFlow – Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES  (one row per auth.users row)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  name        TEXT        DEFAULT '',
  picture     TEXT        DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "profiles: select own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────
-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, picture)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email   = EXCLUDED.email,
    name    = COALESCE(EXCLUDED.name, public.profiles.name),
    picture = COALESCE(EXCLUDED.picture, public.profiles.picture);
  RETURN NEW;
END;
$$;

-- Drop trigger if it already exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 3. WORKOUTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workouts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE        NOT NULL,
  name        TEXT        NOT NULL,
  exercises   JSONB       NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_workouts_user_id   ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date       ON public.workouts(date);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date  ON public.workouts(user_id, date);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: cada usuario solo ve/modifica sus propios workouts
CREATE POLICY "workouts: select own"
  ON public.workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "workouts: insert own"
  ON public.workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workouts: update own"
  ON public.workouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "workouts: delete own"
  ON public.workouts FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 4. AUTO-UPDATE updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_workouts_updated_at ON public.workouts;

CREATE TRIGGER trg_workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 5. STORAGE BUCKET para GIFs (ejecutar desde SQL Editor)
-- ─────────────────────────────────────────────────────────────
-- Crea el bucket "exercise-gifs" como público
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-gifs', 'exercise-gifs', true)
ON CONFLICT (id) DO NOTHING;

-- Política: cualquiera puede leer (bucket público)
CREATE POLICY "exercise-gifs: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exercise-gifs');
