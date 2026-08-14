import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const DEMO_USER: User = {
  id: 'demo-user-id',
  app_metadata: {},
  user_metadata: { name: 'Demo Explorer' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const DEFAULT_DEMO_PROFILE: Profile = {
  id: 'demo-profile-id',
  user_id: 'demo-user-id',
  name: 'Demo Explorer',
  education_level: null,
  current_situation: null,
  interests: [],
  discovery_goal: null,
  xp: 1500,
  level: 4,
  streak: 3,
  last_activity: null,
  onboarding_completed: true,
  assessment_completed: true,
  selected_career_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const getStoredDemoProfile = (): Profile => {
    try {
      const saved = localStorage.getItem('sq_demo_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DEMO_PROFILE;
  };

  const saveDemoProfile = (p: Profile) => {
    try {
      localStorage.setItem('sq_demo_profile', JSON.stringify(p));
    } catch (e) {
      console.error(e);
    }
    setProfile(p);
  };

  async function loadProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        setProfile(getStoredDemoProfile());
        return;
      }
      setProfile(data as Profile);
    } catch {
      setProfile(getStoredDemoProfile());
    }
  }

  useEffect(() => {
    let mounted = true;

    // Safety timeout to prevent infinite spinner
    const timer = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 800);

    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          loadProfile(session.user.id).finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          const isDemoActive = localStorage.getItem('sq_demo_session') === 'true';
          if (isDemoActive) {
            setUser(DEMO_USER);
            setProfile(getStoredDemoProfile());
          }
          setLoading(false);
        }
      }).catch(() => {
        if (mounted) {
          setUser(DEMO_USER);
          setProfile(getStoredDemoProfile());
          setLoading(false);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        (async () => {
          if (!mounted) return;
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            await loadProfile(newSession.user.id);
          }
          setLoading(false);
        })();
      });

      return () => {
        mounted = false;
        clearTimeout(timer);
        authListener.subscription.unsubscribe();
      };
    } catch {
      setUser(DEMO_USER);
      setProfile(getStoredDemoProfile());
      setLoading(false);
    }
  }, []);

  async function signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        localStorage.setItem('sq_demo_session', 'true');
        const newProf = { ...DEFAULT_DEMO_PROFILE, name, onboarding_completed: false, assessment_completed: false };
        saveDemoProfile(newProf);
        setUser({ ...DEMO_USER, user_metadata: { name } });
        return { error: null };
      }

      if (data.user) {
        await loadProfile(data.user.id);
      }
      return { error: null };
    } catch {
      localStorage.setItem('sq_demo_session', 'true');
      const newProf = { ...DEFAULT_DEMO_PROFILE, name, onboarding_completed: false, assessment_completed: false };
      saveDemoProfile(newProf);
      setUser({ ...DEMO_USER, user_metadata: { name } });
      return { error: null };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        localStorage.setItem('sq_demo_session', 'true');
        setUser(DEMO_USER);
        setProfile(getStoredDemoProfile());
        return { error: null };
      }
      return { error: null };
    } catch {
      localStorage.setItem('sq_demo_session', 'true');
      setUser(DEMO_USER);
      setProfile(getStoredDemoProfile());
      return { error: null };
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('sq_demo_session');
    setUser(null);
    setProfile(null);
  }

  async function refreshProfile() {
    if (user && user.id !== 'demo-user-id') {
      await loadProfile(user.id);
    } else {
      setProfile(getStoredDemoProfile());
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return { error: 'Not authenticated' };

    if (user.id === 'demo-user-id') {
      const current = getStoredDemoProfile();
      const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
      saveDemoProfile(updated);
      return { error: null };
    }

    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let error;
      if (existing) {
        const res = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
        error = res.error;
      } else {
        const res = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: profile?.name || user.user_metadata?.name || 'Explorer',
            xp: profile?.xp ?? 0,
            level: profile?.level ?? 1,
            streak: profile?.streak ?? 0,
            onboarding_completed: profile?.onboarding_completed ?? false,
            assessment_completed: profile?.assessment_completed ?? false,
            ...updates,
            updated_at: new Date().toISOString(),
          });
        error = res.error;
      }

      if (error) {
        const current = getStoredDemoProfile();
        saveDemoProfile({ ...current, ...updates });
      } else {
        await refreshProfile();
      }
      return { error: null };
    } catch {
      const current = getStoredDemoProfile();
      saveDemoProfile({ ...current, ...updates });
      return { error: null };
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signUp, signIn, signOut, refreshProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
