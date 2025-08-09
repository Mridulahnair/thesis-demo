"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AuthButton } from "@/components/auth-button";
import { ArrowLeft, MessageCircle, Heart } from "lucide-react";
import { db } from "@/lib/supabase/queries";
import { useAuth } from "@/hooks/useAuth";
import type { PostWithAuthor } from "@/lib/types/database";

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  author_role?: 'mentor' | 'mentee' | 'both';
}

export function PostDetailContent({ id }: { id: string }) {
  const { user, isAuthenticated, redirectToSignIn } = useAuth();
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);

  // Load post data
  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const postData = await db.getPost(id);
        if (postData) {
          setPost(postData);
          // For demo purposes, create some mock comments
          const mockComments: Comment[] = [
            {
              id: "1",
              author_name: "Sarah Chen",
              content: "Great discussion! I've been working with Python for years and would love to share some insights.",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              author_role: "mentor"
            },
            {
              id: "2", 
              author_name: "Alex Rivera",
              content: "This is exactly what I was looking for! Would love to connect and learn more.",
              created_at: new Date(Date.now() - 43200000).toISOString(),
              author_role: "mentee"
            }
          ];
          setComments(mockComments);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      
      // Create new comment (in a real app, this would save to database)
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        author_name: user.user_metadata?.name || user.email?.split('@')[0] || 'You',
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        author_role: 'both' // Default role
      };

      setComments([...comments, newCommentObj]);
      setNewComment("");
      
      // Update replies count
      if (post) {
        setPost({
          ...post,
          replies: post.replies + 1
        });
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    setLiked(!liked);
    if (post) {
      setPost({
        ...post,
        likes: liked ? post.likes - 1 : post.likes + 1
      });
    }
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
              <AuthButton />
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading discussion...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
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
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Discussion Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The discussion you are looking for does not exist.'}</p>
          <Link href="/communities">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Back to Communities</Button>
          </Link>
        </div>
      </main>
    );
  }

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
        {/* Back Button */}
        <Link 
          href={`/communities/${post.community_id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Link>

        {/* Post Content */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <Badge 
                variant="outline"
                className={`text-xs border ${post.profiles?.role === "mentor" ? "bg-green-50 border-green-200 text-green-800" : 
                           post.profiles?.role === "mentee" ? "bg-purple-50 border-purple-200 text-purple-800" : 
                           "bg-gray-50 border-gray-200 text-gray-700"}`}
              >
                {post.profiles?.role || 'member'}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <CardTitle className="text-2xl mb-3 text-gray-900">{post.title}</CardTitle>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span className="font-medium">{post.profiles?.name || 'Unknown'}</span>
              <span>•</span>
              <span>Age {post.profiles?.age || 'N/A'}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                  liked 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{post.replies} replies</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Discussion ({comments.length})</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            <div className="space-y-4">
              <Textarea
                placeholder={isAuthenticated ? "Share your thoughts..." : "Sign in to join the discussion"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                disabled={!isAuthenticated}
              />
              <div className="flex justify-between items-center">
                {!isAuthenticated ? (
                  <p className="text-sm text-gray-600">
                    <button 
                      onClick={redirectToSignIn}
                      className="text-yellow-600 hover:text-yellow-700 underline"
                    >
                      Sign in
                    </button> to join the discussion
                  </p>
                ) : (
                  <div></div>
                )}
                <Button
                  onClick={handleSubmitComment}
                  disabled={!isAuthenticated || !newComment.trim() || submittingComment}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  {submittingComment ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No replies yet. Be the first to join the discussion!
                </p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-medium text-sm">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author_name}</span>
                        {comment.author_role && (
                          <Badge 
                            variant="outline"
                            className={`text-xs border ${comment.author_role === "mentor" ? "bg-green-50 border-green-200 text-green-800" : 
                                       comment.author_role === "mentee" ? "bg-purple-50 border-purple-200 text-purple-800" : 
                                       "bg-gray-50 border-gray-200 text-gray-700"}`}
                          >
                            {comment.author_role}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}