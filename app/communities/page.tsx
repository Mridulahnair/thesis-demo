"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/auth-button";
import { Eye } from "lucide-react";
import { db } from "@/lib/supabase/queries";
import { useAuth } from "@/hooks/useAuth";
import type { CommunityWithStats } from "@/lib/types/database";

export default function Communities() {
  const { user, isAuthenticated, redirectToSignIn } = useAuth();
  const [communities, setCommunities] = useState<CommunityWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<Record<string, boolean>>({});
  const [joiningCommunity, setJoiningCommunity] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const data = await db.getCommunities();
        setCommunities(data);
        
        // Check membership status for authenticated users
        if (isAuthenticated && user) {
          const membershipPromises = data.map(async (community) => {
            const isMember = await db.checkCommunityMembership(community.id, user.id);
            return [community.id, isMember] as const;
          });
          
          const memberships = await Promise.all(membershipPromises);
          const membershipMap = Object.fromEntries(memberships);
          setMembershipStatus(membershipMap);
        }
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCommunities();
  }, [isAuthenticated, user]);

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
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-gray-600 hover:text-yellow-500 transition-colors">
                Search
              </Link>
              <Link href="/communities" className="text-gray-600 hover:text-yellow-500 transition-colors">
                Communities
              </Link>
              <AuthButton />
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Communities</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join specialized communities where generations connect over shared interests and passions.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading communities...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
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
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-gray-600 hover:text-yellow-500 transition-colors">
                Search
              </Link>
              <Link href="/communities" className="text-gray-600 hover:text-yellow-500 transition-colors">
                Communities
              </Link>
              <AuthButton />
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Communities</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join specialized communities where generations connect over shared interests and passions.
            </p>
          </div>
          <div className="text-center text-red-600">{error}</div>
        </div>
      </main>
    );
  }

  const handleJoinCommunity = async (communityId: string) => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user) return;

    try {
      setJoiningCommunity(communityId);
      
      if (membershipStatus[communityId]) {
        // Leave community
        await db.leaveCommunity(communityId, user.id);
        setMembershipStatus(prev => ({ ...prev, [communityId]: false }));
      } else {
        // Join community
        await db.joinCommunity(communityId, user.id);
        setMembershipStatus(prev => ({ ...prev, [communityId]: true }));
      }
    } catch (err) {
      console.error('Error toggling community membership:', err);
      alert('Failed to update community membership. Please try again.');
    } finally {
      setJoiningCommunity(null);
    }
  };

  const featuredCommunities = communities.filter(c => c.featured);
  const otherCommunities = communities.filter(c => !c.featured);

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
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Search
            </Link>
            <Link href="/communities" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Communities
            </Link>
            <Link href="/map" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Events
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Communities</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join specialized communities where generations connect over shared interests and passions.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 animate-fade-in">Featured Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCommunities.map((community, index) => (
              <Card key={community.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow animate-scale-in flex flex-col h-full" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-lg leading-tight text-gray-900">{community.name}</CardTitle>
                    <Badge className="bg-yellow-500 text-black font-semibold">
                      Featured
                    </Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {community.description}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="font-medium text-gray-500">{community.member_count} members</span>
                    <span className="font-medium text-gray-500">{community.post_count} posts</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {community.categories.map(category => (
                      <Badge key={category} variant="outline" className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/communities/${community.id}`}>
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white px-3" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                      size="sm"
                      onClick={() => handleJoinCommunity(community.id)}
                      disabled={joiningCommunity === community.id}
                    >
                      {joiningCommunity === community.id 
                        ? "..." 
                        : membershipStatus[community.id] 
                        ? "Leave" 
                        : "Join"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">All Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCommunities.map(community => (
              <Card key={community.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg mb-2 text-gray-900">{community.name}</CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {community.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="text-gray-500">{community.member_count} members</span>
                    <span className="text-gray-500">{community.post_count} posts</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {community.categories.slice(0, 3).map(category => (
                      <Badge key={category} variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {category}
                      </Badge>
                    ))}
                    {community.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                        +{community.categories.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/communities/${community.id}`}>
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white px-3" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                      size="sm"
                      onClick={() => handleJoinCommunity(community.id)}
                      disabled={joiningCommunity === community.id}
                    >
                      {joiningCommunity === community.id 
                        ? "..." 
                        : membershipStatus[community.id] 
                        ? "Leave" 
                        : "Join"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-white border border-gray-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Don&apos;t see your interest?</h3>
              <p className="text-gray-600 mb-4">
                Suggest a new community and help bring people together around shared passions.
              </p>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Suggest a Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}