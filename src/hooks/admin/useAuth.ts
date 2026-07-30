import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';

const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour session timeout
const SESSION_START_KEY = 'admin_session_start_time';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = async () => {
    localStorage.removeItem(SESSION_START_KEY);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const handleSession = (currentSession: Session | null, event?: string) => {
      if (timerId) clearTimeout(timerId);

      if (currentSession) {
        // If a fresh login event occurred, reset the session start time
        if (event === 'SIGNED_IN') {
          localStorage.setItem(SESSION_START_KEY, Date.now().toString());
        }

        let startTimeStr = localStorage.getItem(SESSION_START_KEY);
        let startTime = startTimeStr ? parseInt(startTimeStr, 10) : 0;

        if (!startTime || isNaN(startTime)) {
          startTime = Date.now();
          localStorage.setItem(SESSION_START_KEY, startTime.toString());
        }

        const elapsedTime = Date.now() - startTime;

        if (elapsedTime >= ONE_HOUR_MS) {
          signOut();
          setIsLoading(false);
          return;
        }

        const remainingTime = ONE_HOUR_MS - elapsedTime;

        timerId = setTimeout(() => {
          signOut();
        }, remainingTime);
      } else {
        localStorage.removeItem(SESSION_START_KEY);
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      handleSession(session, event);
    });

    return () => {
      if (timerId) clearTimeout(timerId);
      subscription.unsubscribe();
    };
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, session, isLoading, signOut } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


