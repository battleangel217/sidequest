'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types';
import { Zap, Calendar, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onSubmitProof?: () => void;
}

export function TaskCard({ task, onSubmitProof }: TaskCardProps) {
  const isDaily = task.frequency === 'daily';
  const isAvailable = task.status === 'available';
  const isPending = task.status === 'pending';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-foreground">{task.title}</h3>
            <Badge variant={isDaily ? 'default' : 'secondary'} className="text-xs">
              {isDaily ? 'Daily' : 'Weekly'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>

        <div className="text-right ml-4">
          <div className="flex items-center gap-1 text-accent font-bold">
            <Zap className="w-4 h-4" />
            {task.expReward}
          </div>
          <p className="text-xs text-muted-foreground">EXP</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-3 border-t border-b border-border mb-4">
        {task.dueTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            Due {task.dueTime}
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {new Date(task.createdDate).toLocaleDateString()}
        </div>
      </div>

      {isPending && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-3 mb-4 text-sm text-amber-700 dark:text-amber-400">
          Pending approval from moderators
        </div>
      )}

      <div className="flex gap-2">
        {isAvailable && (
          <Button
            onClick={onSubmitProof}
            className="flex-1"
            size="sm"
          >
            Submit Proof
          </Button>
        )}
        {!isAvailable && (
          <Button
            disabled
            className="flex-1"
            size="sm"
            variant="outline"
          >
            {isPending ? 'Pending Review' : task.status}
          </Button>
        )}
      </div>
    </Card>
  );
}
