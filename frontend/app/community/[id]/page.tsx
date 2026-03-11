'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoggedInNavbar } from '@/components/logged-in-navbar';
import { TaskCard } from '@/components/tasks/task-card';
import { UploadModal } from '@/components/tasks/upload-modal';
import { InviteModal } from '@/components/community/invite-modal';
import { MemberRow } from '@/components/community/member-row';
import { getCurrentUser, initializeStorage } from '@/lib/auth';
import { mockCommunities, mockTasks, mockCommunityMembers } from '@/lib/data';
import { User, Community, Task } from '@/lib/types';
import { Users, Share2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CommunityPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const communityId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    initializeStorage();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    const selectedCommunity = mockCommunities[communityId];
    if (!selectedCommunity) {
      router.push('/dashboard');
      return;
    }

    setUser(currentUser);
    setCommunity(selectedCommunity);
    setTasks(
      Object.values(mockTasks)
        .filter((t) => t.communityId === communityId)
        .sort((a, b) => (a.frequency === 'daily' ? -1 : 1))
    );
    setLoading(false);
  }, [router, communityId]);

  const handleTaskProofSubmit = (proof: string) => {
    if (!selectedTaskId) return;

    toast({
      title: 'Proof Submitted!',
      description: 'Your submission is pending community moderator approval',
    });

    setTasks(
      tasks.map((t) =>
        t.id === selectedTaskId ? { ...t, status: 'pending' as const } : t
      )
    );
    setSelectedTaskId(null);
  };

  if (loading || !user || !community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading community...</p>
      </div>
    );
  }

  const dailyTasks = tasks.filter((t) => t.frequency === 'daily');
  const weeklyTasks = tasks.filter((t) => t.frequency === 'weekly');
  const members = mockCommunityMembers[community.id] || [];
  const leaderboardMembers = [...members].sort((a, b) => b.weeklyEXP - a.weeklyEXP);

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{community.name}</h1>
              <p className="text-muted-foreground max-w-2xl">{community.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setInviteOpen(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold text-primary">{community.memberCount}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-bold text-secondary">#3</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Community EXP</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-accent">428</p>
                <Zap className="w-5 h-5 text-accent" />
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList>
            <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Daily Tasks */}
          <TabsContent value="daily" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Daily Tasks</h2>
            {dailyTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No daily tasks available</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {dailyTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSubmitProof={() => {
                      setSelectedTaskId(task.id);
                      setUploadOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Weekly Tasks */}
          <TabsContent value="weekly" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Weekly Tasks</h2>
            {weeklyTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No weekly tasks available</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {weeklyTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSubmitProof={() => {
                      setSelectedTaskId(task.id);
                      setUploadOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Members */}
          <TabsContent value="members" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6" />
              Members ({members.length})
            </h2>
            <Card>
              {members.map((member) => (
                <MemberRow key={member.userId} member={member} />
              ))}
            </Card>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Weekly Leaderboard</h2>
            <Card>
              {leaderboardMembers.map((member, index) => (
                <MemberRow
                  key={member.userId}
                  member={member}
                  isLeaderboard
                  rank={index + 1}
                />
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        taskTitle={tasks.find((t) => t.id === selectedTaskId)?.title || ''}
        onSubmit={handleTaskProofSubmit}
      />

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        communityName={community.name}
        inviteCode={community.inviteCode}
      />
    </div>
  );
}
