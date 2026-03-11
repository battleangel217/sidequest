'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  current,
  max,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = (current / max) * 100;

  return (
    <div>
      {label && (
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {showPercentage && (
            <p className="text-sm text-muted-foreground">{Math.round(percentage)}%</p>
          )}
        </div>
      )}
      <Progress value={percentage} className="h-3" />
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{current}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
