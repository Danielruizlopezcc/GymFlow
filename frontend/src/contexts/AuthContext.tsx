import React, {
  createContext, useContext, useState, useEffect, useCallback,
} from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';

// ── Tipos públicos ────────────────────────────────────────────
export interface AppUser {
  id: string;        // UUID de Supabase Auth
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// ── Helper: Supabase user → AppUser ──────────────────────────
function toAppUser(su: SupabaseUser): AppUser {
  const meta = su.user_metadata ?? {};
  return {
    id:      su.id,
    email:   su.email ?? '',
    name:    meta.full_name ?? meta.name ?? '',
    picture: meta.avatar_url ?? meta.picture ?? '',
  };
}

// ── Context ───────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login:  async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Inicialización y listener de sesión ───────────────────
  useEffect(() => {
    // Obtener sesión actual al arrancar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? toAppUser(session.user) : null);
      setLoading(false);
    });

    // Escuchar cambios: login, logout, token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ? toAppUser(session.user) : null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Login con Google ──────────────────────────────────────
  const login = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        // Web: redirección estándar; Supabase detecta el token desde el hash
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: { prompt: 'select_account' },
          },
        });
      } else {
        // Mobile: flujo PKCE + WebBrowser in-app
        const redirectTo = Linking.createURL('/');

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            skipBrowserRedirect: true,
            queryParams: { prompt: 'select_account' },
          },
        });
        if (error) throw error;

        if (data.url) {
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
          if (result.type === 'success' && result.url) {
            // Intercambiar código PKCE por sesión
            const { error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(result.url);
            if (exchangeError) throw exchangeError;
          }
        }
      }
    } catch (e) {
      console.error('[Auth] login error:', e);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('[Auth] logout error:', e);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
