// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  exp: number;
  streak: number;
  best_streak: 0;
  last_activity_data: string;
  avatar?: string;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  memberCount: number;
  inviteCode: string;
  members: string[];
  created: string;
  isPrivate?: boolean;
}

export interface CommunityMember {
  userId: string;
  username: string;
  level: number;
  communityEXP: number;
  weeklyEXP: number;
  joinedDate: string;
}

// Task Types
export type TaskFrequency = 'daily' | 'weekly';
export type TaskStatus = 'available' | 'pending' | 'approved' | 'rejected' | 'completed';

export interface Task {
  id: string;
  communityId: string;
  title: string;
  description: string;
  expReward: number;
  frequency: TaskFrequency;
  dueTime?: string;
  status: TaskStatus;
  submittedBy?: string;
  proofUrl?: string;
  submissionDate?: string;
  createdDate: string;
}

export interface TaskSubmission {
  taskId: string;
  userId: string;
  proofUrl: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

// Notification Types
export type NotificationType = 'invite' | 'approval' | 'rejection' | 'streak_warning';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

// Auth Types
export interface AuthUser {
  refresh: string;
  access: string;
  data: User;
}
