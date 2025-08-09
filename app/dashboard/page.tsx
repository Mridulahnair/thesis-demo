"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial user and profile
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      // Get user profile if it exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profile);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push("/auth/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">K</span>
              </div>
              Knit
            </Link>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            Knit
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Search
            </Link>
            <Link href="/communities" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Communities
            </Link>
            <Button onClick={handleSignOut} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back{profile?.name ? `, ${profile.name}` : ''}!
          </h1>
          <p className="text-xl text-gray-600">
            Ready to connect across generations and share your wisdom?
          </p>
        </div>

        {/* Profile Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    <span className="text-sm text-gray-600">Profile set up</span>
                  </div>
                  {profile.role && (
                    <div className="text-sm text-gray-600">
                      Role: <span className="capitalize">{profile.role}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Incomplete</Badge>
                  <p className="text-sm text-gray-600">Complete your profile to start connecting</p>
                  <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Complete Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Communities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-600 mb-3">Communities joined</p>
              <Link href="/communities">
                <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">
                  Browse Communities
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-sm text-gray-600 mb-3">Active connections</p>
              <Link href="/search">
                <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">
                  Find People
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/communities">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" size="sm">
                  Join a Community
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" size="sm">
                  Find Mentors
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" size="sm">
                  Find Mentees
                </Button>
              </Link>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white" size="sm">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Tips */}
        <Card className="bg-gray-50 border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="font-medium text-gray-900">Complete your profile</h4>
                  <p className="text-sm text-gray-600">Add your interests, skills, and what you would like to learn or teach</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="font-medium text-gray-900">Join communities</h4>
                  <p className="text-sm text-gray-600">Find communities that match your interests and connect with like-minded people</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h4 className="font-medium text-gray-900">Start connecting</h4>
                  <p className="text-sm text-gray-600">Reach out to mentors or mentees and begin building meaningful relationships</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}