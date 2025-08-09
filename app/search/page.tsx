"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthButton } from "@/components/auth-button";
import { db } from "@/lib/supabase/queries";
import type { CommunityWithStats, ProfileWithInitials } from "@/lib/types/database";

interface CommunitySearchResult extends CommunityWithStats {
  type: "community";
}

interface PersonSearchResult extends ProfileWithInitials {
  type: "person";
}

type SearchResult = CommunitySearchResult | PersonSearchResult;

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
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial data on component mount
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const { communities, people } = await db.search("");
        const results: SearchResult[] = [
          ...communities.map(c => ({ ...c, type: "community" as const })),
          ...people.map(p => ({ ...p, type: "person" as const }))
        ];
        setAllResults(results);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  // Perform search when search term changes
  useEffect(() => {
    if (searchTerm === "") {
      // If search is empty, load all data
      return;
    }

    async function performSearch() {
      setLoading(true);
      try {
        const { communities, people } = await db.search(searchTerm);
        const results: SearchResult[] = [
          ...communities.map(c => ({ ...c, type: "community" as const })),
          ...people.map(p => ({ ...p, type: "person" as const }))
        ];
        setAllResults(results);
      } catch (err) {
        console.error('Error performing search:', err);
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(performSearch, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredResults = allResults.filter(result => {    
    const matchesCategory = selectedCategories.length === 0 ||
      (result.type === "community" 
        ? selectedCategories.some(cat => result.categories.includes(cat))
        : selectedCategories.some(cat => result.interests?.includes(cat) || result.skills?.includes(cat))
      );

    const matchesTab = activeTab === "all" || 
      (activeTab === "communities" && result.type === "community") ||
      (activeTab === "mentors" && result.type === "person" && (result.role === "mentor" || result.role === "both")) ||
      (activeTab === "mentees" && result.type === "person" && (result.role === "mentee" || result.role === "both"));
    
    return matchesCategory && matchesTab;
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
            <div className="flex-1 relative">
              <Input
                placeholder="Search communities, people, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-base border-gray-300 bg-white pr-12"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                </div>
              )}
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
                <p className="text-gray-500 text-lg">Searching...</p>
              </div>
            ) : filteredResults.length > 0 ? (
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
                          <span>{result.member_count} members</span>
                          <span>{result.post_count} posts</span>
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
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 font-semibold text-sm">
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
                            <span className="text-sm text-gray-500">({result.review_count})</span>
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