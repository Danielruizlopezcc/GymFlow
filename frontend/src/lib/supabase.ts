import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL  as string;
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// ── Storage adapter ──────────────────────────────────────────
// On native, persist auth state in SecureStore (encrypted).
// On web, the default localStorage is fine.
const SecureStoreAdapter = {
  getItem:    (key: string) => SecureStore.getItemAsync(key),
  setItem:    (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// ── Supabase client ──────────────────────────────────────────
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:            Platform.OS === 'web' ? undefined : SecureStoreAdapter,
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: Platform.OS === 'web',
    flowType:           'pkce',
  },
  realtime: {
    // Deshabilitado: no usamos suscripciones en tiempo real
    // Evita el error de WebSocket en Node.js < 22 durante el build estático
    params: { eventsPerSecond: -1 },
  },
});

// ── Helper: URL pública de cada GIF ─────────────────────────
// Los GIFs se suben a Supabase Storage → bucket "exercise-gifs"
// con el patrón: {exercise_id}.gif
export function getGifUrl(exerciseId: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/exercise-gifs/${exerciseId}.gif`;
}
