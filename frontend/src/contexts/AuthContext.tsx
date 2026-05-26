import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { storage } from '@/src/utils/storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface User {
  user_id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  processSessionId: (sessionId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  processSessionId: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const token = await storage.secureGet('session_token', '');
      if (!token) {
        setLoading(false);
        return;
      }
      const resp = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setUser(data);
      } else {
        await storage.secureRemove('session_token');
        setUser(null);
      }
    } catch (e) {
      console.error('Check session error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const processSessionId = useCallback(async (sessionId: string) => {
    try {
      const resp = await fetch(`${BACKEND_URL}/api/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (resp.ok) {
        const data = await resp.json();
        await storage.secureSet('session_token', data.session_token);
        setUser(data.user);
      }
    } catch (e) {
      console.error('Process session error:', e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      // Web: check URL hash for session_id
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const hash = window.location.hash;
        const search = window.location.search;
        let sessionId = '';
        if (hash.includes('session_id=')) {
          sessionId = hash.split('session_id=')[1]?.split('&')[0] || '';
        } else if (search.includes('session_id=')) {
          sessionId = search.split('session_id=')[1]?.split('&')[0] || '';
        }
        if (sessionId) {
          await processSessionId(sessionId);
          window.history.replaceState(null, '', window.location.pathname);
          setLoading(false);
          return;
        }
      }

      // Mobile: check initial URL
      if (Platform.OS !== 'web') {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && initialUrl.includes('session_id=')) {
          const sessionId = initialUrl.split('session_id=')[1]?.split('&')[0] || '';
          if (sessionId) {
            await processSessionId(sessionId);
            setLoading(false);
            return;
          }
        }
      }

      await checkSession();
    };

    init();

    // Mobile: listen for deep links
    if (Platform.OS !== 'web') {
      const sub = Linking.addEventListener('url', async (event) => {
        if (event.url.includes('session_id=')) {
          const sessionId = event.url.split('session_id=')[1]?.split('&')[0] || '';
          if (sessionId) {
            await processSessionId(sessionId);
          }
        }
      });
      return () => sub.remove();
    }
  }, []);

  const login = useCallback(async () => {
    const redirectUrl = Platform.OS === 'web'
      ? window.location.origin + '/'
      : Linking.createURL('auth');
    const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;

    if (Platform.OS === 'web') {
      window.location.href = authUrl;
    } else {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      if (result.type === 'success' && result.url) {
        const url = result.url;
        let sessionId = '';
        if (url.includes('session_id=')) {
          sessionId = url.split('session_id=')[1]?.split('&')[0] || '';
        }
        if (sessionId) {
          await processSessionId(sessionId);
        }
      }
    }
  }, [processSessionId]);

  const logout = useCallback(async () => {
    try {
      const token = await storage.secureGet('session_token', '');
      if (token) {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      await storage.secureRemove('session_token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, processSessionId }}>
      {children}
    </AuthContext.Provider>
  );
}
