import { supabase, isSupabaseConfigured } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

// ============================================
// AUTHENTICATION SERVICE
// ============================================

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Fallback to hardcoded password for offline mode
    if (password === 'loona2024') {
      return { user: { id: 'offline-admin', email: 'admin@captaloona.art' } as User, error: null };
    }
    return { user: null, error: 'Credenciales incorrectas' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

// Sign out
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  await supabase.auth.signOut();
}

// Get current session
export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Get current user
export async function getUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange(callback);
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

// Password reset request
export async function resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Servicio no disponible en modo offline' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Update password
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Servicio no disponible en modo offline' };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
