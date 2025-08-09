"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AuthButton } from "@/components/auth-button";
import { db } from "@/lib/supabase/queries";
import { useAuth } from "@/hooks/useAuth";
import type { CommunityWithStats, PostWithAuthor, ProfileWithInitials } from "@/lib/types/database";

export function CommunityPageContent({ id }: { id: string }) {
  const { user, isAuthenticated, redirectToSignIn } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "mentor" | "mentee" | "both">("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [joiningCommunity, setJoiningCommunity] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});
  const [connectingUser, setConnectingUser] = useState<string | null>(null);
  
  // Supabase data state
  const [community, setCommunity] = useState<CommunityWithStats | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [members, setMembers] = useState<ProfileWithInitials[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    async function loadCommunityData() {
      try {
        setLoading(true);
        const [communityData, postsData, membersData] = await Promise.all([
          db.getCommunity(id),
          db.getPostsForCommunity(id),
          db.getCommunityMembers(id)
        ]);
        
        setCommunity(communityData);
        setPosts(postsData);
        setMembers(membersData);
      } catch (err) {
        console.error('Error loading community data:', err);
        setError('Failed to load community data');
      } finally {
        setLoading(false);
      }
    }

    loadCommunityData();
  }, [id]);

  // Check membership status for authenticated users
  useEffect(() => {
    async function checkMembership() {
      if (isAuthenticated && user && community) {
        try {
          const membershipStatus = await db.checkCommunityMembership(id, user.id);
          setIsMember(membershipStatus);
          
          // Check connection status for community members
          const connectionPromises = members.map(async (member) => {
            if (member.id === user.id) return [member.id, false] as const;
            const hasConnection = await db.checkExistingConnection();
            return [member.id, hasConnection] as const;
          });
          
          const connections = await Promise.all(connectionPromises);
          setConnectionStatus(Object.fromEntries(connections));
        } catch (err) {
          console.error('Error checking membership status:', err);
        }
      }
    }

    checkMembership();
  }, [isAuthenticated, user, community, members, id]);

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
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading community...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !community) {
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
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Community Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The community you are looking for does not exist.'}</p>
          <Link href="/communities">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Back to Communities</Button>
          </Link>
        </div>
      </main>
    );
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (member.bio?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         member.skills?.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesSkill = !skillFilter || 
                        member.skills?.some(skill => 
                          skill.toLowerCase().includes(skillFilter.toLowerCase())
                        );
    
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    
    return matchesSearch && matchesSkill && matchesRole;
  });

  const handleJoinCommunity = async () => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user) return;

    try {
      setJoiningCommunity(true);
      
      if (isMember) {
        await db.leaveCommunity(id, user.id);
        setIsMember(false);
      } else {
        await db.joinCommunity(id, user.id);
        setIsMember(true);
      }
    } catch (err) {
      console.error('Error toggling community membership:', err);
      alert('Failed to update community membership. Please try again.');
    } finally {
      setJoiningCommunity(false);
    }
  };

  const handleConnect = async (userId: string) => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user || user.id === userId) return;

    try {
      setConnectingUser(userId);
      const message = "Hi! I'd love to connect and learn from each other.";
      await db.sendConnectionRequest(user.id, userId, message);
      setConnectionStatus(prev => ({ ...prev, [userId]: true }));
      alert('Connection request sent!');
    } catch (err) {
      console.error('Error sending connection request:', err);
      alert('Failed to send connection request. Please try again.');
    } finally {
      setConnectingUser(null);
    }
  };

  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    if (!isMember) {
      alert('You must join the community to create posts.');
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const newPost = await db.createPost({
        community_id: id,
        author_id: user.id,
        title: newPostTitle,
        content: newPostContent,
        tags: [], // Could extract tags from content or add tag input
      });

      // Add the new post to the local state (with user data for display)
      const postWithAuthor: PostWithAuthor = {
        ...newPost,
        profiles: {
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'You',
          age: null,
          role: 'both' as const,
        }
      };

      setPosts([postWithAuthor, ...posts]);
      setShowNewPostForm(false);
      setNewPostTitle("");
      setNewPostContent("");
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">{community.name}</h1>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{community.member_count} members</span>
                <span>•</span>
                <span>{posts.length} posts</span>
              </div>
            </div>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              onClick={handleJoinCommunity}
              disabled={joiningCommunity}
            >
              {joiningCommunity ? "..." : isMember ? "Leave Community" : "Join Community"}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {community.categories.map(category => (
              <Badge key={category} variant="outline" className="border-gray-300 text-gray-700 bg-white">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === "posts" 
                ? "border-yellow-500 text-yellow-600 font-semibold" 
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Community Board
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === "members" 
                ? "border-yellow-500 text-yellow-600 font-semibold" 
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Find Mentors & Mentees
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            {/* Create Post Section */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="pt-6">
                {showNewPostForm ? (
                  <div className="space-y-4">
                    <Input
                      placeholder="Post title..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <Textarea
                      placeholder="Share your thoughts, ask questions, or start a discussion..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[100px] bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreatePost} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                        Post
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewPostForm(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        redirectToSignIn();
                        return;
                      }
                      if (!isMember) {
                        alert('You must join the community to create posts.');
                        return;
                      }
                      setShowNewPostForm(true);
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Start a New Discussion
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full cursor-pointer">
                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <Badge 
                        variant="outline"
                        className={`text-xs border ${post.profiles?.role === "mentor" ? "bg-green-50 border-green-200 text-green-800" : 
                                   post.profiles?.role === "mentee" ? "bg-purple-50 border-purple-200 text-purple-800" : 
                                   "bg-gray-50 border-gray-200 text-gray-700"}`}
                      >
                        {post.profiles?.role || 'member'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight mb-2 text-gray-900">{post.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{post.profiles?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>Age {post.profiles?.age || 'N/A'}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.content}</p>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags?.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags && post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <button className="hover:text-yellow-600 transition-colors flex items-center gap-1">
                          👍 {post.likes}
                        </button>
                        <button className="hover:text-yellow-600 transition-colors flex items-center gap-1">
                          💬 {post.replies}
                        </button>
                      </div>
                      <button className="hover:text-yellow-600 transition-colors text-xs">
                        Share
                      </button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  <Input
                    placeholder="Search by name, skills, or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900 placeholder:text-gray-500"
                  />
                  <Input
                    placeholder="Filter by skill..."
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="lg:w-64 bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => setRoleFilter("all")}
                    size="sm"
                    className={roleFilter === "all" ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border-yellow-500" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRoleFilter("mentor")}
                    size="sm"
                    className={roleFilter === "mentor" ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border-yellow-500" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
                  >
                    Mentors
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRoleFilter("mentee")}
                    size="sm"
                    className={roleFilter === "mentee" ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border-yellow-500" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
                  >
                    Mentees
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setRoleFilter("both")}
                    size="sm"
                    className={roleFilter === "both" ? "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border-yellow-500" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
                  >
                    Both
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(member => (
                <Card key={member.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900">{member.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Age {member.age} • {member.location}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs border ${member.role === "mentor" ? "bg-green-50 border-green-200 text-green-800" : 
                                   member.role === "mentee" ? "bg-purple-50 border-purple-200 text-purple-800" : 
                                   "bg-gray-50 border-gray-200 text-gray-700"}`}
                      >
                        {member.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs border-gray-300 text-gray-600">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Link href={`/profile/${member.id}`} className="flex-1">
                        <div className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-center py-2 px-4 rounded-md transition-colors cursor-pointer text-sm font-medium">
                          View Profile
                        </div>
                      </Link>
                      <div 
                        className={`flex-1 text-center py-2 px-4 rounded-md transition-colors cursor-pointer text-sm font-semibold ${
                          user?.id === member.id 
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                            : connectionStatus[member.id] 
                            ? "bg-green-500 hover:bg-green-600 text-white" 
                            : "bg-yellow-500 hover:bg-yellow-600 text-black"
                        }`}
                        onClick={() => handleConnect(member.id)}
                      >
                        {user?.id === member.id 
                          ? "You" 
                          : connectingUser === member.id 
                          ? "..." 
                          : connectionStatus[member.id] 
                          ? "Connected" 
                          : "Connect"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No members match your current filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSkillFilter("");
                    setRoleFilter("all");
                  }}
                  className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}