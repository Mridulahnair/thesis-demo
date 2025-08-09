"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AuthButton } from "@/components/auth-button";
import { Calendar, Clock, MapPin, Users, Video, ExternalLink, MessageCircle, Heart } from "lucide-react";
import { db } from "@/lib/supabase/queries";
import { useAuth } from "@/hooks/useAuth";
import type { EventWithOrganizer } from "@/lib/types/database";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    age: number;
    role: string;
  };
  created_at: string;
  likes: number;
}

interface EventPageContentProps {
  eventId: string;
}

export function EventPageContent({ eventId }: EventPageContentProps) {
  const { user, isAuthenticated, redirectToSignIn } = useAuth();
  const [event, setEvent] = useState<EventWithOrganizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());


  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: "comment-1",
        content: "This looks like a fantastic event! I've been wanting to learn Python for years but never knew where to start. The intergenerational approach sounds perfect.",
        author: { name: "Margaret Chen", age: 67, role: "mentee" },
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        likes: 5
      },
      {
        id: "comment-2", 
        content: "I'll be there! I've been teaching Python for 10+ years and love sharing knowledge with people of all ages. Looking forward to meeting everyone.",
        author: { name: "David Rodriguez", age: 32, role: "mentor" },
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        likes: 8
      },
      {
        id: "comment-3",
        content: "Should I bring my own laptop or will computers be provided? Also, is there parking available at the library?",
        author: { name: "Eleanor Walsh", age: 72, role: "mentee" },
        created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        likes: 3
      }
    ];

    async function loadEvent() {
      try {
        setLoading(true);
        const eventData = await db.getEvent(eventId);
        setEvent(eventData);
        setComments(mockComments);
      } catch (err) {
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  const getEventStatus = (event: EventWithOrganizer) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    
    if (start <= now && end >= now) {
      return { status: 'live', label: '🔴 LIVE NOW', color: 'bg-red-500 text-white' };
    } else if (start.getTime() - now.getTime() < 30 * 60 * 1000 && start > now) { // 30 minutes
      return { status: 'soon', label: '🌟 Starting Soon', color: 'bg-yellow-500 text-black' };
    } else if (start > now) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-green-500 text-white' };
    } else {
      return { status: 'ended', label: 'Ended', color: 'bg-gray-500 text-white' };
    }
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleRSVP = async (status: 'attending' | 'maybe' | 'not_attending') => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user || !event) return;

    try {
      await db.rsvpToEvent(event.id, user.id, status);
      setEvent({
        ...event,
        attendee_count: status === 'attending' ? event.attendee_count + 1 : event.attendee_count
      });
      alert(`RSVP'd ${status} to event!`);
    } catch (err) {
      console.error('Error RSVPing to event:', err);
      alert('Failed to RSVP. Please try again.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      
      // For demo purposes, add mock comment
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: {
          name: user.user_metadata?.name || `User ${user.id.slice(0, 8)}`,
          age: 35, // Mock age
          role: 'mentee'
        },
        created_at: new Date().toISOString(),
        likes: 0
      };

      setComments(prev => [comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const toggleLikeComment = (commentId: string) => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
        // Update likes count
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: comment.likes - 1 }
              : comment
          )
        );
      } else {
        newSet.add(commentId);
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId 
              ? { ...comment, likes: comment.likes + 1 }
              : comment
          )
        );
      }
      return newSet;
    });
  };

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
              <Link href="/map" className="text-gray-600 hover:text-yellow-500 transition-colors">
                Events
              </Link>
              <AuthButton />
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading event details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
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
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/map">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const status = getEventStatus(event);

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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/map" className="text-yellow-600 hover:text-yellow-700 text-sm">
            ← Back to Events
          </Link>
        </div>

        {/* Event Header */}
        <Card className="bg-white border border-gray-200 mb-8">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3">
                <Badge className={`text-sm ${status.color}`}>
                  {status.label}
                </Badge>
                <Badge variant="outline" className="text-sm text-gray-600 border-gray-300">
                  {event.event_type}
                </Badge>
              </div>
              {event.is_online && event.meeting_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(event.meeting_link, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Join Online
                </Button>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{formatEventTime(event.start_time)}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    {Math.round((new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60))} minutes
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{event.location}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    {event.attendee_count} attending
                    {event.max_attendees && ` (${event.max_attendees} max)`}
                  </span>
                </div>
                {event.is_online && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Video className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Online Event</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {event.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm text-gray-600 border-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <div>
                <p className="text-gray-600">
                  Organized by <span className="font-semibold text-gray-900">{event.organizer.name}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {event.organizer.role} • Age {event.organizer.age}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleRSVP('attending')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6"
                >
                  Attend Event
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRSVP('maybe')}
                  className="px-6"
                >
                  Maybe
                </Button>
              </div>
            </div>

            {event.community_id && (
              <div className="mt-4">
                <Link href={`/communities/${event.community_id}`}>
                  <Button variant="outline" size="sm">
                    View Community
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discussion Section */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Discussion ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <Textarea
                placeholder={isAuthenticated ? "Join the conversation about this event..." : "Sign in to join the conversation"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                disabled={!isAuthenticated}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {!isAuthenticated && (
                    <span>
                      <button
                        type="button"
                        onClick={redirectToSignIn}
                        className="text-yellow-600 hover:text-yellow-700 underline"
                      >
                        Sign in
                      </button>
                      {" "}to comment
                    </span>
                  )}
                </span>
                <Button
                  type="submit"
                  disabled={!isAuthenticated || !newComment.trim() || submittingComment}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {submittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>

            {/* Comments */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-700 font-semibold text-sm">
                          {comment.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{comment.author.name}</p>
                        <p className="text-sm text-gray-500">
                          {comment.author.role} • Age {comment.author.age} • {formatTimeAgo(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        likedComments.has(comment.id)
                          ? 'text-red-600'
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                      disabled={!isAuthenticated}
                    >
                      <Heart className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                      {comment.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No comments yet</p>
                <p className="text-gray-400">Be the first to start the conversation about this event!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}