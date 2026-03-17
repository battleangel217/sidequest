'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoggedInNavbar } from '@/components/logged-in-navbar';
import { TaskCard } from '@/components/tasks/task-card';
import { ReviewSubmissionsTab } from '@/components/tasks/review-submissions-tab';
import { UploadModal } from '@/components/tasks/upload-modal';
import { InviteModal } from '@/components/community/invite-modal';
import { MemberRow } from '@/components/community/member-row';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
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
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      initializeStorage();
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      
      setUser(currentUser.data);

      const communityInfo = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${communityId}/`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${currentUser.access}`
            },
          });

          if (!response.ok) {
            if (response.status === 404) {
              router.push('/dashboard');
              return;
            } else if (response.status === 401) {
              router.push('/auth');
              return;
            } else {
              throw new Error("Server Error");
            }
          }

          const data = await response.json();

          const transformed: Community = {
            ...data,
            id: String(data.id),
            isPrivate: data.is_private,
            community_exp: data.community_exp || 0,
            members: data.members
              ? data.members.map((m: any) => ({
                  userId: String(m.user.id),
                  username: m.user.username,
                  avatar: m.user.avatar,
                  level: m.user.level,
                  communityEXP: m.community_exp || 0,
                  user_rank: m.user_rank || 0,
                  weeklyEXP: m.weekly_exp || 0,
                  joinedDate: m.joined_at,
                }))
              : [],
            created: data.created_at,
          };

          setCommunity(transformed);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      const getTask = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${communityId}/`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${currentUser.access}`
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }

          const data = await response.json();
          setTasks(data);
        }catch (error) {
          console.error('Failed to fetch tasks:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch tasks. Please try again later.',
            variant: 'destructive',
          });
        }
      }

      await Promise.all([communityInfo(), getTask()]);
    };
    
    initPage();
  }, [router, communityId]);

  // Fetch pending submissions for admin
  useEffect(() => {
    if (!user || !community) return;
    const isAdminCheck = user.id === community.admin_id;
    if (!isAdminCheck) return;

    const fetchSubmissions = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      setSubmissionsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/submissions/${communityId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchSubmissions();
  }, [user, community, communityId]);

  const handleSubmissionReviewed = (submissionId: number, newStatus: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
  };

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

  const handleCreateTask = (newTaskData: { title: string; description: string; exp_reward: number; task_type: 'daily' | 'weekly' }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      communityId,
      ...newTaskData,
      status: 'available',
      created_at: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setCreateTaskOpen(false);
    toast({
      title: 'Task Created',
      description: 'The new task has been added to the community.',
    });
  };

  if (loading || !user || !community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading community...</p>
      </div>
    );
  }

  console.log(tasks)
  const dailyTasks = tasks.filter((t) => t.task_type === 'daily');
  const weeklyTasks = tasks.filter((t) => t.task_type === 'weekly');
  const members = community.members
  const isAdmin = user.id === community.admin_id;
  const leaderboardMembers = [...members].sort((a, b) => b.weeklyEXP - a.weeklyEXP);

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{community.name}</h1>
              <p className="text-muted-foreground max-w-2xl">{community.description}</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button
                  onClick={() => setCreateTaskOpen(true)}
                >
                  Create Task
                </Button>
              )}
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
              <p className="text-2xl font-bold text-primary">{community.members.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-bold text-secondary">#{community.user_rank}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Community EXP</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-accent">{community.community_exp}</p>
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
            {isAdmin && (
              <TabsTrigger value="review" className="relative">
                Review
                {submissions.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-amber-500 text-white">
                    {submissions.length}
                  </span>
                )}
              </TabsTrigger>
            )}
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

          {/* Review Tab (Admin Only) */}
          {isAdmin && (
            <TabsContent value="review" className="space-y-4">
              <ReviewSubmissionsTab
                communityId={communityId}
                submissions={submissions}
                onSubmissionReviewed={handleSubmissionReviewed}
                loading={submissionsLoading}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Modals */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        taskId={selectedTaskId || ''}
        taskTitle={tasks.find((t) => t.id === selectedTaskId)?.title || ''}
        onSubmit={handleTaskProofSubmit}
      />

      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onSubmit={handleCreateTask}
      />

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        communityName={community.name}
        inviteCode={community.id}
      />
    </div>
  );
}
