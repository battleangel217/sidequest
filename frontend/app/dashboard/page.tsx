'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoggedInNavbar } from '@/components/logged-in-navbar';
import { StreakCard } from '@/components/streaks/streak-card';
import { CommunityCard } from '@/components/community/community-card';
import { getCurrentUser, initializeStorage } from '@/lib/auth';
import { mockCommunities, mockUsers } from '@/lib/data';
import { AuthUser, Community, User } from '@/lib/types';
import { Plus, Users as UsersIcon, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([])
  const [userData, setUserData] = useState<AuthUser | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      initializeStorage();
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      
      setUser(currentUser.data);
      setUserData(currentUser);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/communities/', {
          headers: {
            "Authorization": `Bearer ${currentUser.access}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Transform API data to match frontend types
          const mappedCommunities: Community[] = data.map((c: any) => ({
            ...c,
            id: String(c.id),
            isPrivate: c.is_private,
            inviteCode: 'INVITE', // Placeholder as backend doesn't return this yet
            createdBy: 'System', // Placeholder
            memberCount: c.members ? c.members.length : 0,
            members: c.members ? c.members.map(String) : [],
            created: c.created_at
          }));
          setCommunities(mappedCommunities);
        }
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your quest...</p>
        </div>
      </div>
    );
  }  

  const userCommunities = communities
    .filter((c) => c.members.includes(String(user.id)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.username.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            You're level {user.level} with {user.exp} total EXP
          </p>
        </div>

        {/* Streak Card */}
        <div className="mb-8">
          <StreakCard
            currentStreak={user.streak}
            bestStreak={user.best_streak}
            lastActivityDate={user.last_activity_data}
          />
        </div>

        {/* Communities Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Your Communities</h2>
              <p className="text-muted-foreground">
                {userCommunities.length} communities
              </p>
            </div>
            <Link href="/communities">
              <Button variant="outline">
                <UsersIcon className="w-4 h-4 mr-2" />
                View All
              </Button>
            </Link>
          </div>

          {userCommunities.length === 0 ? (
            <Card className="p-12 text-center">
              <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No Communities Yet</h3>
              <p className="text-muted-foreground mb-6">
                Join or create a community to start earning EXP together
              </p>
              <Link href="/communities">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Explore Communities
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pending Reviews Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Pending Reviews</h2>
              <p className="text-muted-foreground">
                Tasks awaiting approval
              </p>
            </div>
          </div>

          <Card className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              No pending task reviews. Complete more quests to earn EXP.
            </p>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Level</p>
            <p className="text-3xl font-bold text-primary">{user.level}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total EXP</p>
            <p className="text-3xl font-bold text-secondary">{user.exp}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Current Streak</p>
            <p className="text-3xl font-bold text-accent">{user.streak}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Best Streak</p>
            <p className="text-3xl font-bold text-primary">{user.best_streak}</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
