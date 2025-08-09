"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthButton } from "@/components/auth-button";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  categories: string[];
  featured: boolean;
}

const communities: Community[] = [
  {
    id: "tech-digital",
    name: "Tech & Digital Skills",
    description: "Bridging the digital divide. Young tech enthusiasts teaching seniors, while learning wisdom about problem-solving and patience.",
    memberCount: 127,
    postCount: 45,
    categories: ["Technology", "Programming", "Digital Literacy"],
    featured: true
  },
  {
    id: "creative-arts",
    name: "Creative Arts & Crafts",
    description: "Traditional craftsmanship meets modern creativity. Master artisans sharing techniques with emerging artists.",
    memberCount: 89,
    postCount: 32,
    categories: ["Art", "Crafts", "Design", "Photography"],
    featured: true
  },
  {
    id: "cooking-culinary",
    name: "Cooking & Culinary Traditions",
    description: "Family recipes and cooking techniques passed down through generations, mixed with modern culinary innovation.",
    memberCount: 156,
    postCount: 67,
    categories: ["Cooking", "Baking", "Traditional Recipes"],
    featured: false
  },
  {
    id: "career-business",
    name: "Career & Business Wisdom",
    description: "Experienced professionals mentoring young entrepreneurs and career starters. Share insights on leadership and growth.",
    memberCount: 203,
    postCount: 89,
    categories: ["Business", "Career", "Leadership", "Entrepreneurship"],
    featured: true
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    description: "Holistic health practices, fitness routines, and wellness wisdom shared across generations.",
    memberCount: 94,
    postCount: 28,
    categories: ["Health", "Fitness", "Mental Wellness", "Nutrition"],
    featured: false
  },
  {
    id: "gardening-sustainability",
    name: "Gardening & Sustainability",
    description: "Traditional gardening wisdom meets modern sustainability practices. Growing together, literally and figuratively.",
    memberCount: 78,
    postCount: 41,
    categories: ["Gardening", "Sustainability", "Environment"],
    featured: false
  },
  {
    id: "languages-culture",
    name: "Languages & Cultural Exchange",
    description: "Learn languages, share cultural traditions, and build understanding across different backgrounds and generations.",
    memberCount: 112,
    postCount: 55,
    categories: ["Languages", "Culture", "Travel", "Traditions"],
    featured: false
  },
  {
    id: "music-performance",
    name: "Music & Performance Arts",
    description: "From classical to contemporary, share musical knowledge and performance skills across generations.",
    memberCount: 67,
    postCount: 23,
    categories: ["Music", "Performance", "Instruments", "Singing"],
    featured: false
  }
];

export default function Communities() {
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
              <Card key={community.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader>
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
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="font-medium">{community.memberCount} members</span>
                    <span className="font-medium">{community.postCount} posts</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {community.categories.map(category => (
                      <Badge key={category} variant="outline" className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <Link href={`/communities/${community.id}`}>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" size="sm">
                      Join Community
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">All Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span>{community.memberCount} members</span>
                    <span>{community.postCount} posts</span>
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

                  <Link href={`/communities/${community.id}`}>
                    <Button className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" size="sm" variant="outline">
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-white border border-gray-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Don't see your interest?</h3>
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