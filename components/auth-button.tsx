"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthButton() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleSignOut = async () => {
    if (!hasEnvVars) return;
    
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  if (!hasEnvVars) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (user) {
    const getInitials = (email: string) => {
      return email.split('@')[0].slice(0, 2).toUpperCase();
    };

    return (
      <div className="flex items-center gap-3">
        <div className="relative group">
          <button className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-semibold text-sm hover:bg-yellow-600 transition-colors">
            {getInitials(user.email || 'U')}
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900 truncate">{user.email}</div>
            </div>
            <div className="py-1">
              <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>
              <button 
                onClick={handleSignOut}
                className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
