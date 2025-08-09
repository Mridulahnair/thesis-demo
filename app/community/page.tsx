"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/auth-button";

interface CommunityMember {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  role: "mentor" | "mentee" | "both";
  location: string;
}

const mockMembers: CommunityMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    age: 28,
    bio: "Software engineer passionate about teaching coding to seniors. I love bridging the digital divide and learning life wisdom from older generations.",
    interests: ["Technology", "Cooking", "Gardening"],
    role: "both",
    location: "San Francisco, CA"
  },
  {
    id: "2", 
    name: "Robert Wilson",
    age: 67,
    bio: "Retired carpenter with 40 years of woodworking experience. Looking to share traditional craftsmanship skills and learn about modern technology.",
    interests: ["Woodworking", "History", "Technology"],
    role: "mentor",
    location: "Portland, OR"
  },
  {
    id: "3",
    name: "Maya Patel",
    age: 22,
    bio: "College student studying business. Eager to learn from experienced professionals about career development and life skills.",
    interests: ["Business", "Reading", "Traveling"],
    role: "mentee", 
    location: "Austin, TX"
  },
  {
    id: "4",
    name: "Eleanor Martinez",
    age: 72,
    bio: "Former teacher and avid gardener. I want to pass on my love for education and plants while learning about digital art and social media.",
    interests: ["Education", "Gardening", "Art"],
    role: "both",
    location: "Phoenix, AZ"
  },
  {
    id: "5",
    name: "David Kim",
    age: 35,
    bio: "Chef and food blogger looking to learn traditional cooking techniques from experienced home cooks and share modern culinary trends.",
    interests: ["Cooking", "Photography", "Travel"],
    role: "both",
    location: "Seattle, WA"
  },
  {
    id: "6",
    name: "Grace Thompson",
    age: 19,
    bio: "Art student wanting to learn from experienced artists and craftspeople. I'm passionate about preserving traditional art forms.",
    interests: ["Art", "Music", "Literature"],
    role: "mentee",
    location: "Boston, MA"
  }
];

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "mentor" | "mentee" | "both">("all");
  const [selectedInterest, setSelectedInterest] = useState("");

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.interests.some(interest => 
                           interest.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesRole = filterRole === "all" || member.role === filterRole;
    
    const matchesInterest = !selectedInterest || 
                           member.interests.includes(selectedInterest);
    
    return matchesSearch && matchesRole && matchesInterest;
  });

  const allInterests = Array.from(new Set(mockMembers.flatMap(member => member.interests)));

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Board</h1>
          <p className="text-muted-foreground">
            Discover mentors and mentees from all generations. Connect, learn, and grow together.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, bio, or interests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterRole === "all" ? "default" : "outline"}
              onClick={() => setFilterRole("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterRole === "mentor" ? "default" : "outline"}
              onClick={() => setFilterRole("mentor")}
              size="sm"
            >
              Mentors
            </Button>
            <Button
              variant={filterRole === "mentee" ? "default" : "outline"}
              onClick={() => setFilterRole("mentee")}
              size="sm"
            >
              Mentees
            </Button>
            <Button
              variant={filterRole === "both" ? "default" : "outline"}
              onClick={() => setFilterRole("both")}
              size="sm"
            >
              Both
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-muted-foreground mr-2">Filter by interest:</span>
          <Button
            variant={!selectedInterest ? "default" : "outline"}
            onClick={() => setSelectedInterest("")}
            size="sm"
          >
            All Interests
          </Button>
          {allInterests.map(interest => (
            <Button
              key={interest}
              variant={selectedInterest === interest ? "default" : "outline"}
              onClick={() => setSelectedInterest(interest)}
              size="sm"
            >
              {interest}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
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
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {member.bio}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {member.interests.map(interest => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>

                <Link href={`/profile/${member.id}`}>
                  <Button className="w-full" size="sm">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No community members match your current filters.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilterRole("all");
                setSelectedInterest("");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}