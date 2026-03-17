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
import { Copy, Mail, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';


interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName: string;
  inviteCode: string;
}

export function InviteModal({
  open,
  onOpenChange,
  communityName,
  inviteCode,
}: InviteModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${inviteCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Invite link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      toast({ title: 'Error', description: 'You must be logged in to send invites.', variant: 'destructive' });
      router.push('/login');
      return;
    }

    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invite/send`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access}`,
            },
          body: JSON.stringify({
            email,
            community_id: inviteCode,
            title: 'Community Invite',
            message: `You've been invited to join ${communityName}!`
          }),
        }
      );

      if (!response.ok){
        throw new Error('Failed to send invite');
      }

      toast({
        title: 'Invite Sent!',
        description: `Invitation sent to ${email}`,
      });
      setEmail('');

    }catch (error){
      const message = error instanceof Error ? error.message : 'Server Error';
      toast({
        title: 'Failed to Send',
        description: message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] p-4 sm:p-6 rounded-xl gap-4">
        <DialogHeader className="text-left space-y-1.5">
          <DialogTitle className="text-lg sm:text-xl">Invite Members</DialogTitle>
          <DialogDescription className="text-sm">
            Invite people to join {communityName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Invite Link */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none">
              Share Invite Link
            </label>
            <div className="flex items-center gap-2 w-full">
              <Input
                readOnly
                value={inviteLink}
                className="text-xs h-9 flex-1 min-w-0"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyLink}
                className="h-9 w-9 shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Invite code: <span className="font-mono font-bold select-all bg-muted px-1 py-0.5 rounded">{inviteCode}</span>
            </p>
          </div>

          <div className="relative my-1">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                 Or
               </span>
             </div>
           </div>

          {/* Email Invite */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none">
              Send via Email
            </label>
            <form onSubmit={handleEmailInvite} className="flex items-center gap-2 w-full">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-9 min-w-0"
              />
              <Button type="submit" size="icon" variant="outline" className="h-9 w-9 shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="bg-muted p-3 rounded-lg border border-border/50">
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
              Anyone with the invite link or code can join this community. Invites are available for 7 days.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
