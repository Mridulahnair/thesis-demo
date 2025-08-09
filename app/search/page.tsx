"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthButton } from "@/components/auth-button";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  categories: string[];
  type: "community";
}

interface Person {
  id: string;
  name: string;
  initials: string;
  age: number;
  location: string;
  bio: string;
  skills: string[];
  categories: string[];
  rating?: number;
  reviewCount?: number;
  experience: string;
  availability: string;
  role: "mentor" | "mentee" | "both";
  type: "person";
}

type SearchResult = Community | Person;

const mockCommunities: Community[] = [
  {
    id: "tech-digital",
    name: "Tech & Digital Skills",
    description: "Bridging the digital divide. Young tech enthusiasts teaching seniors, while learning wisdom about problem-solving and patience.",
    memberCount: 127,
    postCount: 45,
    categories: ["Technology", "Programming", "Digital Literacy"],
    type: "community"
  },
  {
    id: "creative-arts",
    name: "Creative Arts & Crafts",
    description: "Traditional craftsmanship meets modern creativity. Master artisans sharing techniques with emerging artists.",
    memberCount: 89,
    postCount: 32,
    categories: ["Art", "Crafts", "Design", "Photography"],
    type: "community"
  },
  {
    id: "cooking-culinary",
    name: "Cooking & Culinary Traditions",
    description: "Family recipes and cooking techniques passed down through generations, mixed with modern culinary innovation.",
    memberCount: 156,
    postCount: 67,
    categories: ["Cooking", "Baking", "Traditional Recipes"],
    type: "community"
  }
];

const mockPeople: Person[] = [
  {
    id: "1",
    name: "Margaret Chen",
    initials: "MC",
    age: 67,
    location: "San Francisco, CA",
    bio: "Retired chef with 40 years of experience in traditional Chinese cooking. I love sharing family recipes and techniques passed down through generations.",
    skills: ["Traditional Cooking", "Chinese Cuisine", "Food Preservation", "Knife Skills"],
    categories: ["Culinary Arts"],
    rating: 4.9,
    reviewCount: 127,
    experience: "40+ years",
    availability: "Flexible",
    role: "mentor",
    type: "person"
  },
  {
    id: "2",
    name: "David Rodriguez",
    initials: "DR", 
    age: 45,
    location: "Austin, TX",
    bio: "Financial advisor helping people plan for retirement and build wealth. Passionate about making financial literacy accessible to everyone.",
    skills: ["Financial Planning", "Investment Strategy", "Retirement Planning", "Budgeting"],
    categories: ["Finance"],
    rating: 4.8,
    reviewCount: 89,
    experience: "20+ years",
    availability: "Weekends",
    role: "mentor",
    type: "person"
  },
  {
    id: "3",
    name: "Sarah Kim",
    initials: "SK",
    age: 29,
    location: "Los Angeles, CA", 
    bio: "UX designer passionate about creating accessible digital experiences. Love teaching design thinking and modern creative processes.",
    skills: ["UX Design", "Digital Tools", "Design Thinking", "Prototyping"],
    categories: ["Digital Skills"],
    rating: 4.7,
    reviewCount: 156,
    experience: "8+ years",
    availability: "Evenings",
    role: "both",
    type: "person"
  },
  {
    id: "4",
    name: "Emily Johnson",
    initials: "EJ",
    age: 22,
    location: "Boston, MA",
    bio: "College student studying computer science. Eager to learn from experienced developers and share my knowledge of modern frameworks.",
    skills: ["React", "JavaScript", "Python", "Git"],
    categories: ["Technology"],
    experience: "2+ years",
    availability: "Evenings",
    role: "mentee",
    type: "person"
  },
  {
    id: "5",
    name: "James Wilson",
    initials: "JW",
    age: 19,
    location: "Seattle, WA",
    bio: "Art student looking to learn traditional painting techniques from experienced artists while sharing digital art skills.",
    skills: ["Digital Art", "Photoshop", "Social Media"],
    categories: ["Arts & Crafts"],
    experience: "3+ years",
    availability: "Weekends",
    role: "mentee",
    type: "person"
  }
];

const categories = [
  "Culinary Arts",
  "Digital Skills", 
  "Arts & Crafts",
  "Finance",
  "Lifestyle",
  "Education",
  "Technology",
  "Wellness"
];


export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "communities" | "mentors" | "mentees">("all");

  const allResults: SearchResult[] = [...mockCommunities, ...mockPeople];

  const filteredResults = allResults.filter(result => {
    const matchesSearch = searchTerm === "" || 
      result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (result.type === "community" && result.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.type === "person" && result.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.type === "person" && result.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat => result.categories.includes(cat));

    const matchesTab = activeTab === "all" || 
      (activeTab === "communities" && result.type === "community") ||
      (activeTab === "mentors" && result.type === "person" && (result.role === "mentor" || result.role === "both")) ||
      (activeTab === "mentees" && result.type === "person" && (result.role === "mentee" || result.role === "both"));
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const communitiesCount = filteredResults.filter(r => r.type === "community").length;
  const mentorsCount = filteredResults.filter(r => r.type === "person" && (r.role === "mentor" || r.role === "both")).length;
  const menteesCount = filteredResults.filter(r => r.type === "person" && (r.role === "mentee" || r.role === "both")).length;

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

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
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Search Everything</h1>
          <p className="text-xl text-gray-600 mb-6">Find communities, mentors, and mentees all in one place</p>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search communities, people, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-base border-gray-300 bg-white"
              />
            </div>
            <Button className="h-12 px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              Search
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-600">{filteredResults.length} results found</span>
            
            {/* Tab Filters */}
            <div className="flex gap-1 ml-auto">
              <Button
                variant={activeTab === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? "bg-yellow-500 text-black" : "text-gray-600"}
              >
                All ({filteredResults.length})
              </Button>
              <Button
                variant={activeTab === "communities" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("communities")}
                className={activeTab === "communities" ? "bg-yellow-500 text-black" : "text-gray-600"}
              >
                Communities ({communitiesCount})
              </Button>
              <Button
                variant={activeTab === "mentors" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("mentors")}
                className={activeTab === "mentors" ? "bg-yellow-500 text-black" : "text-gray-600"}
              >
                Mentors ({mentorsCount})
              </Button>
              <Button
                variant={activeTab === "mentees" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("mentees")}
                className={activeTab === "mentees" ? "bg-yellow-500 text-black" : "text-gray-600"}
              >
                Mentees ({menteesCount})
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label 
                          htmlFor={category}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResults.map(result => (
                  <Card key={`${result.type}-${result.id}`} className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
                    {result.type === "community" ? (
                      // Community Tile
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Community</Badge>
                          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-sm">🏘️</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{result.description}</p>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                          <span>{result.memberCount} members</span>
                          <span>{result.postCount} posts</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {result.categories.slice(0, 2).map(category => (
                            <Badge key={category} variant="outline" className="text-xs border-gray-300 text-gray-600">
                              {category}
                            </Badge>
                          ))}
                          {result.categories.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                              +{result.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Link href={`/communities/${result.id}`}>
                          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" size="sm">
                            Join Community
                          </Button>
                        </Link>
                      </CardContent>
                    ) : (
                      // Person Tile
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge 
                            className={
                              result.role === "mentor" 
                                ? "bg-green-100 text-green-800 text-xs" 
                                : result.role === "mentee"
                                ? "bg-purple-100 text-purple-800 text-xs"
                                : "bg-orange-100 text-orange-800 text-xs"
                            }
                          >
                            {result.role === "mentor" ? "Mentor" : result.role === "mentee" ? "Mentee" : "Both"}
                          </Badge>
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                            {result.initials}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{result.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">Age {result.age} • {result.location}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{result.bio}</p>
                        
                        {result.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium">{result.rating}</span>
                            <span className="text-sm text-gray-500">({result.reviewCount})</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {result.skills?.slice(0, 2).map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs border-gray-300 text-gray-600">
                              {skill}
                            </Badge>
                          ))}
                          {(result.skills?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                              +{(result.skills?.length || 0) - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Link href={`/profile/${result.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700">
                              View Profile
                            </Button>
                          </Link>
                          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                            Connect
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No results match your current search and filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    clearFilters();
                    setActiveTab("all");
                  }}
                  className="border-gray-300"
                >
                  Clear Search and Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}