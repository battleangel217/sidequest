'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Flame, Home, LogOut, Settings, User } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { signOut } from '@/lib/auth';
import { StreakBadge } from './streaks/streak-badge';
import { NotificationBell } from './notifications/notification-bell';

interface LoggedInNavbarProps {
  user: UserType;
}

export function LoggedInNavbar({ user }: LoggedInNavbarProps) {
  const router = useRouter();
  const maxEXP = 1000;
  const expProgress = (user.exp % maxEXP) / maxEXP * 100;

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">SideQuest</span>
          </Link>

          {/* Center: EXP Progress */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Level {user.level}
            </span>
            <Progress value={expProgress} className="h-2" />
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {user.exp % 1000}/1K
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Streak Badge */}
            <StreakBadge streak={user.streak} />

            {/* Notifications */}
            <NotificationBell userId={user.id} />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {user.username ? user.username[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex flex-col p-2 gap-2 mb-2">
                  <p className="font-semibold text-foreground">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
