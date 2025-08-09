"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AuthButton } from "@/components/auth-button";

interface CommunityMember {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  role: "mentor" | "mentee" | "both";
  location: string;
  experience: string[];
  availability: string;
  preferredMeetingStyle: string[];
}

const mockMembers: Record<string, CommunityMember> = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    age: 28,
    bio: "Software engineer passionate about teaching coding to seniors. I love bridging the digital divide and learning life wisdom from older generations. My goal is to make technology accessible to everyone while learning valuable life lessons from experienced individuals.",
    interests: ["Technology", "Cooking", "Gardening", "Photography"],
    role: "both",
    location: "San Francisco, CA",
    experience: [
      "5+ years in software development",
      "Volunteer coding instructor at senior centers",
      "Published tech articles for beginners"
    ],
    availability: "Weekends and evenings",
    preferredMeetingStyle: ["Video calls", "Coffee meetups", "Online workshops"]
  },
  "2": {
    id: "2", 
    name: "Robert Wilson",
    age: 67,
    bio: "Retired carpenter with 40 years of woodworking experience. Looking to share traditional craftsmanship skills and learn about modern technology. I believe in the value of working with your hands and want to pass on these skills to younger generations.",
    interests: ["Woodworking", "History", "Technology", "Craftsmanship"],
    role: "mentor",
    location: "Portland, OR",
    experience: [
      "40+ years professional carpentry",
      "Furniture restoration specialist", 
      "Traditional joinery techniques expert"
    ],
    availability: "Flexible, mostly afternoons",
    preferredMeetingStyle: ["In-person workshops", "Phone calls", "Email correspondence"]
  }
};

function ProfileContent({ id }: { id: string }) {
  const [connectionMessage, setConnectionMessage] = useState("");
  const [showConnectionForm, setShowConnectionForm] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const member = mockMembers[id];

  if (!member) {
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
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <Link href="/community">
            <Button>Back to Community</Button>
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                    <p className="text-muted-foreground">
                      Age {member.age} • {member.location}
                    </p>
                  </div>
                  <Badge 
                    variant={member.role === "mentor" ? "default" : 
                           member.role === "mentee" ? "secondary" : "outline"}
                    className="text-sm px-3 py-1"
                  >
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map(interest => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Experience & Skills</h3>
                  <ul className="space-y-1">
                    {member.experience.map((exp, index) => (
                      <li key={index} className="text-muted-foreground flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <p className="text-muted-foreground">{member.availability}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Preferred Meeting Style</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.preferredMeetingStyle.map(style => (
                      <Badge key={style} variant="secondary">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConnected ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary-foreground font-bold">✓</span>
                    </div>
                    <p className="font-semibold text-primary mb-2">Connection Sent!</p>
                    <p className="text-sm text-muted-foreground">
                      {member.name} will receive your message and can respond if interested.
                    </p>
                  </div>
                ) : showConnectionForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Introduce yourself to {member.name}
                      </label>
                      <Textarea
                        placeholder={`Hi ${member.name}! I'd love to connect because...`}
                        value={connectionMessage}
                        onChange={(e) => setConnectionMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSendConnection} className="flex-1">
                        Send Request
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowConnectionForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setShowConnectionForm(true)}
                      className="w-full"
                    >
                      Send Connection Request
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Start a meaningful conversation across generations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Safety Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
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

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileContent id={id} />;
}