'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, User, Zap, FileText, Loader2 } from 'lucide-react';

interface Submission {
  id: number;
  user: { id: number; username: string };
  task: {
    id: number;
    title: string;
    description: string;
    exp_reward: number;
    task_type: string;
  };
  status: string;
  proof_text: string;
  proof_image: string | null;
  proof_video: string | null;
  submitted_at: string;
  updated_at: string;
}

interface ReviewSubmissionsTabProps {
  communityId: string;
  submissions: Submission[];
  onSubmissionReviewed: (submissionId: number, newStatus: string) => void;
  loading: boolean;
}

export function ReviewSubmissionsTab({
  communityId,
  submissions,
  onSubmissionReviewed,
  loading,
}: ReviewSubmissionsTabProps) {
  const { toast } = useToast();
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  const handleReview = async (submissionId: number, newStatus: 'approved' | 'rejected') => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    setReviewingId(submissionId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/review/${submissionId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to review submission');
      }

      onSubmissionReviewed(submissionId, newStatus);

      toast({
        title: newStatus === 'approved' ? '✅ Submission Approved' : '❌ Submission Rejected',
        description: newStatus === 'approved'
          ? 'The member has been awarded their EXP.'
          : 'The submission has been rejected.',
      });
    } catch (error) {
      console.error('Review failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to review submission. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setReviewingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading submissions...</span>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <CheckCircle className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">All caught up!</p>
          <p className="text-sm text-muted-foreground/70">
            No pending submissions to review right now.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" />
          Pending Reviews ({submissions.length})
        </h2>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card
            key={submission.id}
            className="p-6 hover:shadow-md transition-all duration-200 border-l-4 border-l-amber-400"
          >
            {/* Header: Task info + EXP */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">{submission.task.title}</h3>
                  <Badge
                    variant={submission.task.task_type === 'daily' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {submission.task.task_type === 'daily' ? 'Daily' : 'Weekly'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{submission.task.description}</p>
              </div>
              <div className="text-right ml-4">
                <div className="flex items-center gap-1 text-accent font-bold">
                  <Zap className="w-4 h-4" />
                  {submission.task.exp_reward}
                </div>
                <p className="text-xs text-muted-foreground">EXP</p>
              </div>
            </div>

            {/* Submitter info & proof */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">
                  {submission.user.username}
                </span>
                <span className="text-muted-foreground">
                  submitted {new Date(submission.submitted_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              {submission.proof_text && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground bg-background rounded p-2 flex-1 border">
                    {submission.proof_text}
                  </p>
                </div>
              )}

              {/* Proof media */}
              {(submission.proof_image || submission.proof_video) && (
                <div className="space-y-2">
                  {submission.proof_image && (
                    <div className="rounded-lg overflow-hidden border">
                      <img
                        src={`https://res.cloudinary.com/dxunny9ef/${submission.proof_image}`}
                        alt="Proof image"
                        className="w-full max-h-80 object-contain bg-black/5"
                      />
                    </div>
                  )}
                  {submission.proof_video && (
                    <div className="rounded-lg overflow-hidden border">
                      <video
                        src={`https://res.cloudinary.com/dxunny9ef/${submission.proof_video}`}
                        controls
                        className="w-full max-h-80"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleReview(submission.id, 'approved')}
                disabled={reviewingId === submission.id}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                {reviewingId === submission.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Approve
              </Button>
              <Button
                onClick={() => handleReview(submission.id, 'rejected')}
                disabled={reviewingId === submission.id}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                size="sm"
              >
                {reviewingId === submission.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
