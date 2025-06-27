import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase/client';
import { updateProfile, syncProfileFromDatabase } from './profile';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, isAuthenticated: !!session }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear profile data
      updateProfile({ username: '', bio: '', avatar: '' });
      
      set({ user: null, session: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (session) {
        set({ session, user: session.user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      set({ session: null, user: null, isAuthenticated: false });
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(async ({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setLoading(false);
  
  // Sync profile from database if user is authenticated
  if (session?.user) {
    await syncProfileFromDatabase(session.user.id);
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange(async (_event, session) => {
  useAuthStore.getState().setSession(session);
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setLoading(false);
  
  // Sync profile from database on sign in
  if (_event === 'SIGNED_IN' && session?.user) {
    await syncProfileFromDatabase(session.user.id);
  }
});