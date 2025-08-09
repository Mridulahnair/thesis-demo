"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white border border-gray-200 shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl text-gray-900 text-center">Create Account</CardTitle>
          <CardDescription className="text-gray-600 text-center">Connect across generations and share your story</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio" className="text-gray-700 font-medium">Tell us about yourself</Label>
                <Textarea
                  id="bio"
                  placeholder="Share your interests, what you'd like to learn or teach, and what brings you to this community..."
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px] bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password" className="text-gray-700 font-medium">Confirm Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-base" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <Link href="/auth/login" className="text-yellow-600 hover:text-yellow-700 font-medium underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
