import { supabase } from './supabase';

// ── Tipos ─────────────────────────────────────────────────────
export interface WorkoutExercise {
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  weight: number | null;
  notes: string;
}

export interface Workout {
  id: string;               // UUID
  user_id: string;
  date: string;             // ISO date "YYYY-MM-DD"
  name: string;
  exercises: WorkoutExercise[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutCreate {
  date: string;
  name: string;
  exercises: WorkoutExercise[];
}

// ── Helpers ───────────────────────────────────────────────────

/** Lista los workouts del usuario autenticado.
 *  Si se pasa `month` (ej. "2025-05") filtra por mes.
 *  Si se pasa `date` (ej. "2025-05-26") filtra por día exacto.
 */
export async function listWorkouts(opts: {
  month?: string;
  date?: string;
} = {}): Promise<Workout[]> {
  let query = supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: true });

  if (opts.date) {
    query = query.eq('date', opts.date);
  } else if (opts.month) {
    // Filtrar "YYYY-MM-*"
    query = query
      .gte('date', `${opts.month}-01`)
      .lte('date', `${opts.month}-31`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Workout[];
}

/** Crea un nuevo workout para el usuario autenticado */
export async function createWorkout(workout: WorkoutCreate): Promise<Workout> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No hay sesión activa');

  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id:   user.id,
      date:      workout.date,
      name:      workout.name,
      exercises: workout.exercises,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Workout;
}

/** Elimina un workout por ID */
export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

/** Actualiza nombre y/o ejercicios de un workout */
export async function updateWorkout(
  id: string,
  patch: Partial<Pick<Workout, 'name' | 'exercises'>>
): Promise<Workout> {
  const { data, error } = await supabase
    .from('workouts')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Workout;
}
