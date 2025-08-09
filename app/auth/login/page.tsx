import { LoginForm } from "@/components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-svh bg-white">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            Knit
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to continue bridging generations</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
