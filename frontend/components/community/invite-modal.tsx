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

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // In a real app, this would send an email
    toast({
      title: 'Invite Sent!',
      description: `Invitation sent to ${email}`,
    });
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Invite people to join {communityName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Invite Link */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Share Invite Link
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={inviteLink}
                className="text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyLink}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Invite code: <span className="font-mono font-bold">{inviteCode}</span>
            </p>
          </div>

          {/* Email Invite */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Or Send via Email
            </label>
            <form onSubmit={handleEmailInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="icon" variant="outline">
                <Mail className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              Anyone with the invite link or code can join this community. Invites are available for 7 days.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
