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
import type { CommunityWithStats, PostWithAuthor, ProfileWithInitials } from "@/lib/types/database";



function CommunityPageContent({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "mentor" | "mentee" | "both">("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  
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


  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      // For now, we'll use a placeholder user ID since auth isn't fully implemented
      // In a real app, this would get the user ID from the auth context
      const placeholderUserId = '00000000-0000-0000-0000-000000000000';
      
      const newPost = await db.createPost({
        community_id: id,
        author_id: placeholderUserId,
        title: newPostTitle,
        content: newPostContent,
        tags: [], // Could extract tags from content or add tag input
      });

      // Add the new post to the local state (with mock author data for display)
      const postWithAuthor: PostWithAuthor = {
        ...newPost,
        profiles: {
          name: 'You',
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
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Join Community</Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {community.categories.map(category => (
              <Badge key={category} variant="outline">
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
            <Card>
              <CardContent className="pt-6">
                {showNewPostForm ? (
                  <div className="space-y-4">
                    <Input
                      placeholder="Post title..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Share your thoughts, ask questions, or start a discussion..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreatePost}>Post</Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewPostForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowNewPostForm(true)} className="w-full">
                    Start a New Discussion
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <span>{post.profiles?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>Age {post.profiles?.age || 'N/A'}</span>
                          <Badge 
                            variant={post.profiles?.role === "mentor" ? "default" : "secondary"}
                            className={`text-xs ${post.profiles?.role === "mentor" ? "bg-green-100 text-green-800" : 
                                       post.profiles?.role === "mentee" ? "bg-purple-100 text-purple-800" : 
                                       "bg-gray-100 text-gray-800"}`}
                          >
                            {post.profiles?.role || 'member'}
                          </Badge>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500">{post.content}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button className="hover:text-yellow-600 transition-colors">
                        👍 {post.likes}
                      </button>
                      <button className="hover:text-yellow-600 transition-colors">
                        💬 {post.replies} replies
                      </button>
                      <button className="hover:text-yellow-600 transition-colors">
                        Share
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  <Input
                    placeholder="Search by name, skills, or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Filter by skill..."
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="lg:w-64"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={roleFilter === "all" ? "default" : "outline"}
                    onClick={() => setRoleFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={roleFilter === "mentor" ? "default" : "outline"}
                    onClick={() => setRoleFilter("mentor")}
                    size="sm"
                  >
                    Mentors
                  </Button>
                  <Button
                    variant={roleFilter === "mentee" ? "default" : "outline"}
                    onClick={() => setRoleFilter("mentee")}
                    size="sm"
                  >
                    Mentees
                  </Button>
                  <Button
                    variant={roleFilter === "both" ? "default" : "outline"}
                    onClick={() => setRoleFilter("both")}
                    size="sm"
                  >
                    Both
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(member => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Age {member.age} • {member.location}
                        </p>
                      </div>
                      <Badge variant={member.role === "mentor" ? "default" : 
                                   member.role === "mentee" ? "secondary" : "outline"}
                             className={member.role === "mentor" ? "bg-green-100 text-green-800" : 
                                       member.role === "mentee" ? "bg-purple-100 text-purple-800" : ""}>
                        {member.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{member.bio}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href={`/profile/${member.id}`} className="block mt-4">
                      <Button className="w-full" size="sm">
                        Connect
                      </Button>
                    </Link>
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
                  className="mt-4"
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

export default async function CommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommunityPageContent id={id} />;
}