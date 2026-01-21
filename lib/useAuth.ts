import { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, getSession, onAuthStateChange } from './auth';
import { isSupabaseConfigured } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  // For backwards compatibility - simple password check
  loginWithPassword: (password: string) => boolean;
}

// Fallback password for offline mode
const FALLBACK_PASSWORD = 'loona2024';

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offlineAuth, setOfflineAuth] = useState(false);

  useEffect(() => {
    // Check initial session
    const initAuth = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        const currentSession = await getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data } = onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return false;
      }

      if (result.user) {
        setUser(result.user);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err) {
      setError('Error al iniciar sesión');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      setSession(null);
      setOfflineAuth(false);
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Simple password check for backwards compatibility
  const loginWithPassword = useCallback((password: string): boolean => {
    if (password === FALLBACK_PASSWORD) {
      setOfflineAuth(true);
      setUser({ id: 'offline-admin', email: 'admin@captaloona.art' } as User);
      return true;
    }
    setError('Contraseña incorrecta');
    return false;
  }, []);

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: Boolean(user) || offlineAuth,
    login,
    logout,
    loginWithPassword,
  };
}

export default useAuth;
