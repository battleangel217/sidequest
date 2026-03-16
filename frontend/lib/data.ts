import { User, Community, Task, CommunityMember, Notification } from './types';

export const mockUsers: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    username: 'Alex Rivera',
    email: 'alex@example.com',
    level: 24,
    totalEXP: 8450,
    currentStreak: 12,
    bestStreak: 28,
    lastActivityDate: new Date().toISOString(),
    avatar: 'AR',
  },
  'user-2': {
    id: 'user-2',
    username: 'Jordan Lee',
    email: 'jordan@example.com',
    level: 18,
    totalEXP: 5320,
    currentStreak: 5,
    bestStreak: 15,
    lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: 'JL',
  },
};

export const mockCommunities: Record<string, Community> = {
  'community-1': {
    id: 'community-1',
    name: 'Morning Code Challenge',
    description: 'Daily coding challenges to sharpen your skills before work',
    admin_id: 'user-1',
    members: [
      {
        userId: 'user-1',
        username: 'Alex Rivera',
        level: 24,
        communityEXP: 1200,
        weeklyEXP: 450,
        joinedDate: new Date().toISOString(),
      },
      {
        userId: 'user-2',
        username: 'Jordan Lee',
        level: 18,
        communityEXP: 800,
        weeklyEXP: 200,
        joinedDate: new Date().toISOString(),
      }
    ],
    created: new Date().toISOString(),
  },
  'community-2': {
    id: 'community-2',
    name: 'Fitness Legends',
    description: 'Build healthy habits together with daily workouts and accountability',
    admin_id: 'user-2',
    members: [
      {
        userId: 'user-2',
        username: 'Jordan Lee',
        level: 18,
        communityEXP: 500,
        weeklyEXP: 100,
        joinedDate: new Date().toISOString(),
      }
    ],
    created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  'community-3': {
    id: 'community-3',
    name: 'Writing Sprint Club',
    description: 'Weekly writing challenges to develop your creative voice',
    admin_id: 'user-1',
    members: [
      {
        userId: 'user-1',
        username: 'Alex Rivera',
        level: 24,
        communityEXP: 300,
        weeklyEXP: 100,
        joinedDate: new Date().toISOString(),
      }
    ],
    created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

export const mockTasks: Record<string, Task> = {
  'task-1': {
    id: 'task-1',
    communityId: 'community-1',
    title: 'Solve LeetCode Medium Problem',
    description: 'Complete one medium difficulty problem on LeetCode and share your solution',
    exp_reward: 150,
    task_type: 'daily',
    due_time: '2026-12-31T23:59:00.000Z',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  'task-2': {
    id: 'task-2',
    communityId: 'community-1',
    title: 'Code Review a Peer Solution',
    description: 'Review and provide constructive feedback on another member\'s code',
    exp_reward: 100,
    task_type: 'daily',
    due_time: '2026-12-31T23:59:00.000Z',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  'task-3': {
    id: 'task-3',
    communityId: 'community-2',
    title: 'Complete 30-Minute Workout',
    description: 'Do any workout for at least 30 minutes. Submit a video or screenshot of your activity tracker',
    exp_reward: 200,
    task_type: 'daily',
    due_time: '2026-12-31T23:59:00.000Z',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  'task-4': {
    id: 'task-4',
    communityId: 'community-2',
    title: 'Weekly Fitness Challenge',
    description: 'Complete 5 workouts this week. Must be documented with proof',
    exp_reward: 500,
    task_type: 'weekly',
    due_time: '2026-12-31T23:59:00.000Z',
    status: 'available',
    created_at: new Date().toISOString(),
  },
  'task-5': {
    id: 'task-5',
    communityId: 'community-3',
    title: 'Write 1000 Words',
    description: 'Write 1000 words on any topic. Share your word count as proof',
    exp_reward: 300,
    task_type: 'weekly',
    due_time: '2026-12-31T23:59:00.000Z',
    status: 'available',
    created_at: new Date().toISOString(),
  },
};

export const mockCommunityMembers: Record<string, CommunityMember[]> = {
  'community-1': [
    {
      userId: 'user-1',
      username: 'Alex Rivera',
      level: 24,
      communityEXP: 2340,
      weeklyEXP: 780,
      joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: 'user-2',
      username: 'Jordan Lee',
      level: 18,
      communityEXP: 1850,
      weeklyEXP: 520,
      joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  'community-2': [
    {
      userId: 'user-2',
      username: 'Jordan Lee',
      level: 18,
      communityEXP: 3200,
      weeklyEXP: 1200,
      joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const mockNotifications: Notification[] = [
  {
    id: 1,
    user: 1,
    type: 'invite',
    title: 'Community Invite',
    message: 'You\'ve been invited to join Fitness Legends',
    related_id: 2,
    is_read: false,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    user: 1,
    type: 'approval',
    title: 'Task Approved',
    message: 'Your submission for "Solve LeetCode Medium Problem" was approved!',
    related_id: 1,
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    user: 1,
    type: 'streak_warning',
    title: 'Streak at Risk',
    message: 'Your 12-day streak is at risk! Complete a task within 24 hours to keep it alive',
    is_read: true,
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
];
