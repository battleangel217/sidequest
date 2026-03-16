'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Flame, Users, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-accent" />
            <span className="text-xl sm:text-2xl font-bold text-foreground">SideQuest</span>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Link href="/auth">
              <Button variant="outline" size="sm" className="sm:h-10 sm:px-4 sm:py-2">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="sm:h-10 sm:px-4 sm:py-2">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 text-balance">
              Turn Your Productivity Into a Game
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 text-balance">
              Join communities, complete quests, build unstoppable streaks, and level up your life. SideQuest makes productivity social, fun, and rewarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Quest
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 sm:h-96 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center mt-8 lg:mt-0">
            <div className="text-center">
              <Flame className="w-16 h-16 sm:w-24 sm:h-24 text-accent mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">Your streak awaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-border py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose SideQuest?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground text-balance">
              Everything you need to build unbreakable habits and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1: Streaks */}
            <Card className="p-6 sm:p-8 hover:shadow-lg transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Build Streaks</h3>
              <p className="text-muted-foreground">
                Complete daily quests and watch your streak grow. The longer your streak, the higher your motivation.
              </p>
            </Card>

            {/* Feature 2: Communities */}
            <Card className="p-6 sm:p-8 hover:shadow-lg transition-shadow">
              <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Join Communities</h3>
              <p className="text-muted-foreground">
                Find your people. Invite-only communities keep the vibe right and members committed.
              </p>
            </Card>

            {/* Feature 3: Level Up */}
            <Card className="p-6 sm:p-8 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Earn EXP & Levels</h3>
              <p className="text-muted-foreground">
                Complete tasks, earn experience points, and climb the leaderboard. Every achievement counts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10K+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Active Questers</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">500+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Communities</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">1M+</div>
            <p className="text-sm sm:text-base text-muted-foreground">Quests Completed</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">4.9★</div>
            <p className="text-sm sm:text-base text-muted-foreground">User Rating</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Ready to Start Your Quest?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 text-balance">
            Join thousands building life-changing habits. Free to start, forever free for individuals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Sign Up Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-primary text-primary-foreground border-primary-foreground/30 hover:bg-primary/90">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-6 h-6 text-accent" />
                <span className="font-bold text-foreground">SideQuest</span>
              </div>
              <p className="text-sm text-muted-foreground">Gamifying productivity, one quest at a time.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 SideQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
