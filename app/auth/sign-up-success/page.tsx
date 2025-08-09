import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            Knit
          </Link>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-2xl">✓</span>
                </div>
                <CardTitle className="text-2xl">
                  Welcome to Knit!
                </CardTitle>
                <CardDescription>Check your email to confirm your account</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  We&apos;ve sent you a confirmation email. Please click the link in your email to verify your account and complete the signup process.
                </p>
                <div className="space-y-3">
                  <Link href="/">
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      Return to Home
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                      Already confirmed? Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
