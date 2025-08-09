import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
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

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 bg-white">
        <div className="max-w-4xl text-center space-y-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Bridging
            <span className="text-yellow-500"> Generations</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Connect across age groups. Share wisdom. Build meaningful relationships 
            that transcend generational boundaries through our vibrant communities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button size="lg" asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/auth/sign-up">Join Community</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-gray-300 text-gray-900 hover:bg-gray-50 bg-white">
              <Link href="/communities">Browse Communities</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 animate-fade-in">Community Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border border-gray-200 hover:shadow-lg transition-shadow animate-scale-in">
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-yellow-500 mb-3">89%</div>
                <p className="text-gray-600 leading-relaxed">
                  of mentorship connections lead to lasting relationships
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-white border border-gray-200 hover:shadow-lg transition-shadow animate-scale-in" style={{animationDelay: '0.1s'}}>
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-yellow-500 mb-3">500+</div>
                <p className="text-gray-600 leading-relaxed">
                  active community members across all generations
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-white border border-gray-200 hover:shadow-lg transition-shadow animate-scale-in" style={{animationDelay: '0.2s'}}>
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-yellow-500 mb-3">2.4x</div>
                <p className="text-gray-600 leading-relaxed">
                  increase in cross-generational understanding
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 animate-fade-in">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4 animate-slide-up">
              <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center text-black font-bold text-xl mx-auto hover:bg-yellow-600 transition-colors shadow-lg">
                1
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Create Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your story, interests, and what you&apos;re looking to learn or teach
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center text-black font-bold text-xl mx-auto hover:bg-yellow-600 transition-colors shadow-lg">
                2
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Join Communities</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover specialized communities and connect with like-minded people
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center text-black font-bold text-xl mx-auto hover:bg-yellow-600 transition-colors shadow-lg">
                3
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Connect & Share</h3>
              <p className="text-gray-600 leading-relaxed">
                Send connection requests, post in community boards, and start conversations
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center text-black font-bold text-xl mx-auto hover:bg-yellow-600 transition-colors shadow-lg">
                4
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Grow Together</h3>
              <p className="text-gray-600 leading-relaxed">
                Build lasting relationships that enrich both lives across generations
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-8 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">Building bridges across generations, one connection at a time.</p>
        </div>
      </footer>
    </main>
  );
}
