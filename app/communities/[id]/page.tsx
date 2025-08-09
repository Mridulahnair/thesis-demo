"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AuthButton } from "@/components/auth-button";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAge: number;
  authorRole: "mentor" | "mentee" | "both";
  timestamp: string;
  replies: number;
  likes: number;
  tags: string[];
}

interface CommunityMember {
  id: string;
  name: string;
  age: number;
  role: "mentor" | "mentee" | "both";
  skills: string[];
  bio: string;
  location: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  categories: string[];
}

const communities: Record<string, Community> = {
  "tech-digital": {
    id: "tech-digital",
    name: "Tech & Digital Skills",
    description: "Bridging the digital divide. Young tech enthusiasts teaching seniors, while learning wisdom about problem-solving and patience.",
    memberCount: 127,
    categories: ["Technology", "Programming", "Digital Literacy"]
  },
  "creative-arts": {
    id: "creative-arts", 
    name: "Creative Arts & Crafts",
    description: "Traditional craftsmanship meets modern creativity. Master artisans sharing techniques with emerging artists.",
    memberCount: 89,
    categories: ["Art", "Crafts", "Design", "Photography"]
  }
};

const mockPosts: Record<string, Post[]> = {
  "tech-digital": [
    {
      id: "1",
      title: "Learning Python at 70 - My Journey So Far",
      content: "I never thought I'd be writing code at my age, but thanks to my mentor Sarah, I've built my first web scraper! It's amazing how patient the younger generation can be.",
      author: "Robert Wilson",
      authorAge: 70,
      authorRole: "mentee",
      timestamp: "2 hours ago",
      replies: 12,
      likes: 34,
      tags: ["Python", "Learning", "Success Story"]
    },
    {
      id: "2", 
      title: "Teaching UI Design to Someone Who Lived Through the Dawn of Computing",
      content: "My mentor George has incredible insights about user experience that I never considered. His perspective from using the first computers gives me a unique view on modern design.",
      author: "Maya Chen",
      authorAge: 24,
      authorRole: "mentee",
      timestamp: "5 hours ago", 
      replies: 8,
      likes: 21,
      tags: ["UI/UX", "Design", "Perspective"]
    },
    {
      id: "3",
      title: "Question: Best Resources for Learning Smartphone Photography?",
      content: "I want to help my mentee improve their phone photography skills, but I realize I need to learn the latest techniques myself. Any recommendations?",
      author: "Elena Martinez",
      authorAge: 45,
      authorRole: "mentor",
      timestamp: "1 day ago",
      replies: 15,
      likes: 18,
      tags: ["Photography", "Mobile", "Resources"]
    }
  ],
  "creative-arts": [
    {
      id: "4",
      title: "Traditional Pottery Meets Digital Art",
      content: "Combining 40 years of pottery experience with my mentee's digital art skills to create augmented reality pottery pieces!",
      author: "James Thompson",
      authorAge: 65,
      authorRole: "mentor", 
      timestamp: "3 hours ago",
      replies: 7,
      likes: 28,
      tags: ["Pottery", "Digital Art", "AR", "Collaboration"]
    }
  ]
};

const mockMembers: Record<string, CommunityMember[]> = {
  "tech-digital": [
    {
      id: "1",
      name: "Sarah Chen",
      age: 28,
      role: "mentor",
      skills: ["Python", "Web Development", "UI/UX Design", "Mobile Apps"],
      bio: "Full-stack developer passionate about teaching coding to seniors",
      location: "San Francisco, CA"
    },
    {
      id: "2", 
      name: "Robert Wilson",
      age: 70,
      role: "mentee",
      skills: ["Problem Solving", "System Architecture", "Project Management"],
      bio: "Retired engineer learning modern programming languages",
      location: "Portland, OR"
    },
    {
      id: "3",
      name: "Maya Chen", 
      age: 24,
      role: "both",
      skills: ["React", "Node.js", "Database Design", "Leadership"],
      bio: "Junior developer eager to learn from experienced professionals",
      location: "Austin, TX"
    }
  ]
};

function CommunityPageContent({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "mentor" | "mentee" | "both">("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const community = communities[id];
  const posts = mockPosts[id] || [];
  const members = mockMembers[id] || [];

  if (!community) {
    return (
      <main className="min-h-screen bg-background">
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">Knit</Link>
            <AuthButton />
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Community Not Found</h1>
          <Link href="/communities">
            <Button>Back to Communities</Button>
          </Link>
        </div>
      </main>
    );
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesSkill = !skillFilter || 
                        member.skills.some(skill => 
                          skill.toLowerCase().includes(skillFilter.toLowerCase())
                        );
    
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    
    return matchesSearch && matchesSkill && matchesRole;
  });


  const handleCreatePost = () => {
    setShowNewPostForm(false);
    setNewPostTitle("");
    setNewPostContent("");
    // In a real app, this would submit to the backend
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
              <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
              <p className="text-muted-foreground mb-4">{community.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{community.memberCount} members</span>
                <span>•</span>
                <span>{posts.length} posts</span>
              </div>
            </div>
            <Button>Join Community</Button>
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
        <div className="flex gap-4 mb-6 border-b border-border/20">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === "posts" 
                ? "border-primary text-primary font-semibold" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Community Board
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === "members" 
                ? "border-primary text-primary font-semibold" 
                : "border-transparent text-muted-foreground hover:text-foreground"
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>Age {post.authorAge}</span>
                          <Badge 
                            variant={post.authorRole === "mentor" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {post.authorRole}
                          </Badge>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{post.content}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="hover:text-primary transition-colors">
                        👍 {post.likes}
                      </button>
                      <button className="hover:text-primary transition-colors">
                        💬 {post.replies} replies
                      </button>
                      <button className="hover:text-primary transition-colors">
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
                        <p className="text-sm text-muted-foreground">
                          Age {member.age} • {member.location}
                        </p>
                      </div>
                      <Badge variant={member.role === "mentor" ? "default" : 
                                   member.role === "mentee" ? "secondary" : "outline"}>
                        {member.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    
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
                <p className="text-muted-foreground">
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