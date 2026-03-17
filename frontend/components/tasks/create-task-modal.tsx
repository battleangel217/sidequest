'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';


interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: { title: string; description: string; exp_reward: number; task_type: 'daily' | 'weekly' }) => void;
  isLoading?: boolean;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expReward, setExpReward] = useState('');
  const [taskType, setTaskType] = useState<'daily' | 'weekly'>('daily');
  const params = useParams()
  const communityId = params.id as string;
  const { toast } = useToast();
  const router = useRouter()

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !expReward.trim()) {
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      toast({ title: 'Error', description: 'You must be logged in to create a task.', variant: 'destructive' });
      router.push('/login');
      return;
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${communityId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentUser.access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        exp_reward: parseInt(expReward, 10),
        task_type: taskType,
      }),

    });

    if (response.ok) {
      const data = await response.json();
      onSubmit({
        title,
        description,
        exp_reward: parseInt(expReward, 10),
        task_type: taskType,
      });
      onOpenChange(false);
      toast({ title: 'Task Created', description: 'Your task has been created successfully.' });
    } else {
      // Handle error (you can show a toast or alert here)
      toast({ title: 'Error', description: 'Failed to create task. Please try again.', variant: 'destructive' });
      console.error('Failed to create task');
    }
    
    // Reset form after submit
    setTitle('');
    setDescription('');
    setExpReward('');
    setTaskType('daily');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new daily or weekly task for this community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              placeholder="e.g. Solve LeetCode Medium Problem" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Detailed description of what members need to do..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">EXP Reward</label>
              <Input 
                type="number" 
                placeholder="e.g. 150" 
                value={expReward}
                onChange={(e) => setExpReward(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task Type</label>
              <Select value={taskType} onValueChange={(value: 'daily' | 'weekly') => setTaskType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !title.trim() || !description.trim() || !expReward.trim()}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
