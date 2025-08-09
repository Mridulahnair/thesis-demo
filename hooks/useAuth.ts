"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { hasEnvVars } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasEnvVars) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!hasEnvVars) return;
    
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const redirectToSignIn = () => {
    window.location.href = '/auth/login';
  };

  return {
    user,
    loading,
    signOut,
    redirectToSignIn,
    isAuthenticated: !!user
  };
}