# GymFlow - Gym Training Companion App

## Overview
GymFlow is a mobile fitness application inspired by Lyfta that helps gym-goers organize their workouts, discover exercises, and plan their training schedule.

## Core Features

### 1. Exercise Library (83 exercises)
- Browse exercises organized by muscle groups (chest, back, shoulders, upper arms, lower arms, upper legs, lower legs, waist)
- Filter by body part with color-coded pill buttons
- Search exercises by name
- Each exercise shows: name, body part, equipment type, primary muscles

### 2. Exercise Detail
- **About tab**: Primary muscles (red indicator), secondary muscles (blue indicator), body part, target muscle, equipment type
- **Instructions tab**: Step-by-step numbered instructions for proper form
- **Alternatives tab**: Smart recommendation system showing exercises that target the same muscles with different equipment - solves the "machine is busy" problem

### 3. Workout Calendar Planner
- Monthly calendar view with workout day indicators (blue dots)
- Tap any date to see planned workouts
- Create new workouts with custom names (e.g., "Push Day", "Leg Day")
- Add exercises from the library with configurable sets, reps, and weight
- Delete workouts

### 4. Authentication
- Google OAuth via Emergent Auth
- Session-based authentication with 7-day token expiry
- Secure token storage (expo-secure-store on mobile, localStorage on web)

### 5. User Profile
- Display user info from Google account
- Logout functionality

## Tech Stack
- **Frontend**: React Native / Expo (SDK 54) with Expo Router
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: Emergent Google OAuth

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | No | Health check |
| GET | /api/exercises | No | List/search/filter exercises |
| GET | /api/exercises/body-parts | No | List body parts |
| GET | /api/exercises/targets | No | List target muscles |
| GET | /api/exercises/{id} | No | Exercise detail |
| GET | /api/exercises/{id}/similar | No | Similar exercises |
| POST | /api/auth/session | No | Create auth session |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/auth/logout | Yes | Logout |
| POST | /api/workouts | Yes | Create workout |
| GET | /api/workouts | Yes | List user workouts |
| GET | /api/workouts/{id} | Yes | Get workout detail |
| PUT | /api/workouts/{id} | Yes | Update workout |
| DELETE | /api/workouts/{id} | Yes | Delete workout |

## Data Model
- **Users**: user_id, email, name, picture, created_at
- **Exercises**: exercise_id, name, body_part, target, equipment, primary_muscles[], secondary_muscles[], instructions[], category
- **Workouts**: workout_id, user_id, date, name, exercises[{exercise_id, name, sets, reps, weight, notes}]
- **Sessions**: session_token, user_id, expires_at, created_at

## Muscle Groups Covered
- Chest (12 exercises)
- Back (13 exercises)
- Shoulders (12 exercises)
- Upper Arms / Biceps & Triceps (12 exercises)
- Upper Legs / Quads, Hamstrings & Glutes (12 exercises)
- Lower Legs / Calves (4 exercises)
- Core / Abs (8 exercises)
- Lower Arms / Forearms (2 exercises)
- Additional compound exercises (8 exercises)

## Future Enhancements
- ~~Exercise GIF animations via ExerciseDB API integration~~ ✅ Done (83/83 mapped)
- ~~Full Spanish localization~~ ✅ Done
- ~~Real images on welcome screen~~ ✅ Done
- Workout history tracking and progress charts
- Exercise sets/reps logging during workout
- Social features (share routines)
- Muscle body map visualization (SVG diagrams)
- Premium subscription for AI-powered workout recommendations

## Recent Changes (this session)
- ✅ Welcome screen: replaced Ionicon-based hero/feature icons with premium gym photographs (dark moody hero, anatomy/planner/dumbbells imagery for feature cards).
- ✅ GIFs now display in every exercise reference: exercise list, exercise detail hero, similar/alternative exercises, workout planner cards on calendar, and workout creation picker + selected items.
- ✅ Backend GIF mapping completed: 83/83 (100%) exercises mapped to RapidAPI ExerciseDB IDs (script `remap_missing_gifs.py` with manual overrides + target-based fuzzy fallback).
- ✅ Profile tab title corrected to "Perfil", weekday/month labels in calendar translated, remaining English copy converted to Spanish (workout-create, exercise-detail error states, etc.).

