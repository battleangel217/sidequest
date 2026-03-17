'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoggedInNavbar } from '@/components/logged-in-navbar';
import { StreakCard } from '@/components/streaks/streak-card';
import { ProgressBar } from '@/components/progress/progress-bar';
import { getCurrentUser, initializeStorage } from '@/lib/auth';
import { mockCommunities, mockTasks } from '@/lib/data';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Zap, TrendingUp, Users } from 'lucide-react';
import { get } from 'http';

// Mock EXP breakdown data
const expBreakdownData = [
  { name: 'Morning Code', exp: 450 },
  { name: 'Fitness', exp: 680 },
  { name: 'Writing', exp: 320 },
];

// Mock completed tasks
// const completedTasks = [
//   {
//     id: '1',
//     title: 'Solve LeetCode Problem',
//     community: 'Morning Code Challenge',
//     expReward: 150,
//     completedDate: '2026-03-02',
//   },
//   {
//     id: '2',
//     title: 'Complete 30-Minute Workout',
//     community: 'Fitness Legends',
//     expReward: 200,
//     completedDate: '2026-03-01',
//   },
//   {
//     id: '3',
//     title: 'Code Review',
//     community: 'Morning Code Challenge',
//     expReward: 100,
//     completedDate: '2026-02-28',
//   },
// ];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  useEffect(() => {
    const initProfile = async () => {
      initializeStorage();
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      setUser(currentUser.data);

      const getUserInfo = async () => {
        try{
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser.access}`,
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }

          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

      const fetchCompletedTasks = async () => {
        try{
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/completed/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentUser.access}`,
            },
          });

          const task = await response.json()
          setCompletedTasks(task);
        } catch (error) {
          console.error('Error fetching completed tasks:', error);
        }
      };

      await Promise.all([getUserInfo(), fetchCompletedTasks()]);
      setLoading(false);
    };

    initProfile();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const weeklyData = user.weekly_breakdown || [
    { day: 'Mon', exp: 0 },
    { day: 'Tue', exp: 0 },
    { day: 'Wed', exp: 0 },
    { day: 'Thu', exp: 0 },
    { day: 'Fri', exp: 0 },
    { day: 'Sat', exp: 0 },
    { day: 'Sun', exp: 0 },
  ];

  const nextLevelEXP = 1000;
  const currentLevelEXP = user.exp % nextLevelEXP;
  const totalCommunities = Object.values(mockCommunities).filter((c) =>
    c.members.some((m) => m.userId === user.id)
  ).length;
  console.log(user)

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-end gap-6 mb-6">
            <Avatar className="h-24 w-24">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold">
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-foreground">{user.username}</h1>
              <p className="text-muted-foreground">Level {user.level} Quester</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Level</p>
              <p className="text-3xl font-bold text-primary">{user.level}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total EXP</p>
              <div className="flex items-center gap-1">
                <p className="text-3xl font-bold text-secondary">{user.exp}</p>
                <Zap className="w-5 h-5 text-secondary" />
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Communities</p>
              <p className="text-3xl font-bold text-accent">{user.community_count}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-primary">{user.streak}</p>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="p-6 mb-8">
            <ProgressBar
              current={currentLevelEXP}
              max={nextLevelEXP}
              label={`Progress to Level ${user.level + 1}`}
            />
          </Card>

          {/* Streak Card */}
          <StreakCard
            currentStreak={user.streak}
            bestStreak={user.best_streak}
            lastActivityDate={user.last_activity_data}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            <TabsTrigger value="breakdown">EXP Breakdown</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Weekly Progress</h2>
            <Card className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-background)',
                      border: `1px solid var(--color-border)`,
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="exp"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)' }}
                    name="EXP Earned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Week Total</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-primary">{user.weekly_total}</p>
                  <Zap className="w-4 h-4 text-primary" />
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Daily Average</p>
                <p className="text-2xl font-bold text-secondary">{user.weekly_total ? Math.round(user.weekly_total / 7) : 0}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Streak Days</p>
                <p className="text-2xl font-bold text-accent">{user.streak}</p>
              </Card>
            </div>
          </TabsContent>

          {/* Completed Tasks Tab */}
          <TabsContent value="completed" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Completed Tasks</h2>
            <Card>
              {completedTasks.length === 0 ? (
                <p className="text-muted-foreground p-5 text-center">
                Join communities and Complete more quests to earn EXP.
              </p>
              ): (
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Community</TableHead>
                    <TableHead>EXP</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.task.title}</TableCell>
                      <TableCell>{task.task.community}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-secondary">{task.task.exp_reward}</span>
                          <Zap className="w-4 h-4 text-secondary" />
                        </div>
                      </TableCell>
                      <TableCell>{new Date(task.updated_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </Card>
          </TabsContent>

          {/* EXP Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">EXP by Community</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {expBreakdownData.map((item) => (
                <Card key={item.name} className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">{item.name}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-3xl font-bold text-primary">{item.exp}</p>
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(item.exp / 680) * 100}%`,
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
