'use client';

import { Flame } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const isAtRisk = streak > 0 && streak < 3;
  const isBroken = streak === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 px-3 py-2 rounded-full font-bold text-sm ${
            isBroken
              ? 'bg-slate-100 dark:bg-slate-900 text-muted-foreground'
              : isAtRisk
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
              : 'bg-accent/10 text-accent'
          }`}>
            <Flame className={`w-4 h-4 ${isBroken ? '' : 'animate-pulse'}`} />
            <span>{streak}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isBroken
              ? 'Start your streak by completing a task'
              : isAtRisk
              ? `Your ${streak}-day streak is at risk! Complete a task today to keep it alive.`
              : `You're on a ${streak}-day streak! Keep it going!`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
