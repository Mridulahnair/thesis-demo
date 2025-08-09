"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AuthButton } from "@/components/auth-button";
import { db } from "@/lib/supabase/queries";
import type { ProfileWithInitials } from "@/lib/types/database";

export function ProfileContent({ id }: { id: string }) {
  const [connectionMessage, setConnectionMessage] = useState("");
  const [showConnectionForm, setShowConnectionForm] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState<ProfileWithInitials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const profileData = await db.getProfile(id);
        if (profileData) {
          const profileWithInitials = {
            ...profileData,
            initials: profileData.name 
              ? profileData.name.split(' ').map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2)
              : 'UN'
          };
          setProfile(profileWithInitials);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

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
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
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
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The profile you are looking for does not exist.'}</p>
          <Link href="/search">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Back to Search</Button>
          </Link>
        </div>
      </main>
    );
  }

  const handleSendConnection = () => {
    setIsConnected(true);
    setShowConnectionForm(false);
    setConnectionMessage("");
  };

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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2 text-gray-900">{profile.name}</CardTitle>
                    <p className="text-gray-600">
                      Age {profile.age} • {profile.location}
                    </p>
                  </div>
                  <Badge 
                    variant={profile.role === "mentor" ? "default" : 
                           profile.role === "mentee" ? "secondary" : "outline"}
                    className="text-sm px-3 py-1"
                  >
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">About</h3>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests?.map(interest => (
                      <Badge key={interest} variant="outline" className="border-gray-300 text-gray-700 bg-white">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Skills</h3>
                  <ul className="space-y-1">
                    {profile.skills?.map((skill, index) => (
                      <li key={index} className="text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {profile.rating && (
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900">Rating</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{profile.rating}</span>
                      <span className="text-sm text-gray-500">({profile.review_count} reviews)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConnected ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-foreground font-bold">✓</span>
                    </div>
                    <p className="font-semibold text-primary mb-2">Connection Sent!</p>
                    <p className="text-sm text-gray-600">
                      {profile.name} will receive your message and can respond if interested.
                    </p>
                  </div>
                ) : showConnectionForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Introduce yourself to {profile.name}
                      </label>
                      <Textarea
                        placeholder={`Hi ${profile.name}! I'd love to connect because...`}
                        value={connectionMessage}
                        onChange={(e) => setConnectionMessage(e.target.value)}
                        className="min-h-[100px] bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSendConnection} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                        Send Request
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowConnectionForm(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setShowConnectionForm(true)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                    >
                      Send Connection Request
                    </Button>
                    <p className="text-xs text-gray-600 text-center">
                      Start a meaningful conversation across generations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6 bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Safety Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Meet in public places for first meetings</p>
                <p>• Trust your instincts</p>
                <p>• Keep personal information private initially</p>
                <p>• Report any concerns to our support team</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}