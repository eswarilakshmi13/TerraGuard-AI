import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { riskZones, alerts } from '@/data/demoData';

export type UserRole = 'Citizen' | 'Field Officer' | 'Authority';

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  zone_name: string;
  risk_level: string;
  risk_probability: number;
  is_read: boolean;
  created_at: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string, role: UserRole) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
    return data as UserProfile | null;
  }, []);

  const fetchNotifications = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, message, zone_name, risk_level, risk_probability, is_read, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching notifications:', error.message);
      return;
    }
    setNotifications(data as AppNotification[]);
  }, []);

  const generateRiskNotification = useCallback(async (_userId: string) => {
    const highestRiskZone = [...riskZones].sort((a, b) => b.riskProbability - a.riskProbability)[0];
    const matchingAlert = alerts.find((a) => a.zoneName === highestRiskZone.name);

    const title = `${highestRiskZone.riskLevel} ALERT — ${highestRiskZone.name}`;
    const message = matchingAlert
      ? `Risk: ${highestRiskZone.riskProbability}%. Triggers: ${matchingAlert.triggers.join(', ')}. Action: ${matchingAlert.recommendedAction}`
      : `Risk probability: ${highestRiskZone.riskProbability}%. Zone ${highestRiskZone.name} in ${highestRiskZone.district}, ${highestRiskZone.state} is currently at ${highestRiskZone.riskLevel} risk. Monitor conditions and follow safety protocols.`;

    const { error } = await supabase.from('notifications').insert({
      title,
      message,
      zone_name: highestRiskZone.name,
      risk_level: highestRiskZone.riskLevel,
      risk_probability: highestRiskZone.riskProbability,
    });

    if (error) {
      console.error('Error creating notification:', error.message);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        Promise.all([
          fetchProfile(session.user.id),
          fetchNotifications(session.user.id),
        ]).then(([profileData]) => {
          if (!mounted) return;
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      (async () => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id);
          if (!mounted) return;
          setProfile(profileData);

          if (event === 'SIGNED_IN') {
            await generateRiskNotification(newSession.user.id);
          }
          await fetchNotifications(newSession.user.id);
        } else {
          setProfile(null);
          setNotifications([]);
        }
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile, fetchNotifications, generateRiskNotification]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: UserRole
  ): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role },
      },
    });

    if (error) return { error: error.message };
    if (!data.user) return { error: 'Sign-up failed. Please try again.' };

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      phone,
      role,
    });

    if (profileError) {
      return { error: `Account created but profile setup failed: ${profileError.message}` };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setNotifications([]);
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const refreshNotifications = async () => {
    if (user) await fetchNotifications(user.id);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        notifications,
        unreadCount,
        loading,
        signUp,
        signIn,
        signOut,
        markNotificationRead,
        markAllRead,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
