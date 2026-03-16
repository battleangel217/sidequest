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
  community_count?: number;
  weekly_total?: number;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description: string;
  admin_id: string;
  members: CommunityMember[];
  community_exp: number;
  user_rank: number;
  created: string;
  isPrivate?: boolean;
}

export interface CommunityMember {
  userId: string;
  username: string;
  avatar?: string;
  level: number;
  communityEXP: number;
  weeklyEXP: number;
  joinedDate: string;
}

// Task Types
export type TaskType = 'daily' | 'weekly';
export type TaskStatus = 'available' | 'pending' | 'approved' | 'rejected' | 'completed';

export interface Task {
  id: string;
  communityId: string;
  title: string;
  description: string;
  exp_reward: number;
  task_type: TaskType;
  due_time?: string;
  status: TaskStatus;
  submission_status?: string | null;
  submittedBy?: string;
  proofUrl?: string;
  submissionDate?: string;
  created_at: string;
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
  id: number;
  user: number;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: number;
  is_read: boolean;
  created_at: string;
}

// Auth Types
export interface AuthUser {
  refresh: string;
  access: string;
  data: User;
}
