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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

// Mock EXP breakdown data
const expBreakdownData = [
  { name: 'Morning Code', exp: 450 },
  { name: 'Fitness', exp: 680 },
  { name: 'Writing', exp: 320 },
];

// Mock completed tasks
const completedTasks = [
  {
    id: '1',
    title: 'Solve LeetCode Problem',
    community: 'Morning Code Challenge',
    expReward: 150,
    completedDate: '2026-03-02',
  },
  {
    id: '2',
    title: 'Complete 30-Minute Workout',
    community: 'Fitness Legends',
    expReward: 200,
    completedDate: '2026-03-01',
  },
  {
    id: '3',
    title: 'Code Review',
    community: 'Morning Code Challenge',
    expReward: 100,
    completedDate: '2026-02-28',
  },
];

// Chart data for weekly EXP
const weeklyData = [
  { day: 'Mon', exp: 350 },
  { day: 'Tue', exp: 420 },
  { day: 'Wed', exp: 280 },
  { day: 'Thu', exp: 510 },
  { day: 'Fri', exp: 450 },
  { day: 'Sat', exp: 600 },
  { day: 'Sun', exp: 520 },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const nextLevelEXP = 1000;
  const currentLevelEXP = user.totalEXP % nextLevelEXP;
  const totalCommunities = Object.values(mockCommunities).filter((c) =>
    c.members.includes(user.id)
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-end gap-6 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold">
                {user.avatar}
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
                <p className="text-3xl font-bold text-secondary">{user.totalEXP}</p>
                <Zap className="w-5 h-5 text-secondary" />
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Communities</p>
              <p className="text-3xl font-bold text-accent">{totalCommunities}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-primary">{user.currentStreak}</p>
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
            currentStreak={user.currentStreak}
            bestStreak={user.bestStreak}
            lastActivityDate={user.lastActivityDate}
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
                  <p className="text-2xl font-bold text-primary">3,130</p>
                  <Zap className="w-4 h-4 text-primary" />
                </div>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Daily Average</p>
                <p className="text-2xl font-bold text-secondary">447</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Streak Days</p>
                <p className="text-2xl font-bold text-accent">{user.currentStreak}</p>
              </Card>
            </div>
          </TabsContent>

          {/* Completed Tasks Tab */}
          <TabsContent value="completed" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Completed Tasks</h2>
            <Card>
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
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.community}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-secondary">{task.expReward}</span>
                          <Zap className="w-4 h-4 text-secondary" />
                        </div>
                      </TableCell>
                      <TableCell>{new Date(task.completedDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
