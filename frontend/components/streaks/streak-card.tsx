'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AnimatedFlame } from '@/components/animated-flame';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  lastActivityDate: string;
}

export function StreakCard({ currentStreak, bestStreak, lastActivityDate }: StreakCardProps) {
  const lastActivity = new Date(lastActivityDate);
  const today = new Date();
  const daysAgo = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  const isRisky = currentStreak > 0 && daysAgo >= 1;
  const isBroken = daysAgo > 1;

  return (
    <Card className="p-8 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">Streak Status</h3>
          <p className="text-sm text-muted-foreground">Keep the flame alive</p>
        </div>
        <AnimatedFlame />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Current Streak */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-accent">{currentStreak}</span>
            <span className="text-muted-foreground">days</span>
          </div>
        </div>

        {/* Best Streak */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Best Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{bestStreak}</span>
            <span className="text-muted-foreground">days</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="pt-4 border-t border-accent/20">
        {isBroken ? (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-medium">Streak Broken</span>
            <span className="text-muted-foreground">Complete a task to restart</span>
          </div>
        ) : isRisky ? (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="font-medium text-amber-600 dark:text-amber-400">
              Last activity {daysAgo} day ago
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span className="font-medium text-secondary">On track!</span>
            <span className="text-muted-foreground">Complete tasks today to extend your streak</span>
          </div>
        )}
      </div>
    </Card>
  );
}
