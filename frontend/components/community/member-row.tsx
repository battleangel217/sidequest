'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CommunityMember } from '@/lib/types';
import { Zap } from 'lucide-react';

interface MemberRowProps {
  member: CommunityMember;
  isLeaderboard?: boolean;
  rank?: number;
}

export function MemberRow({ member, isLeaderboard, rank }: MemberRowProps) {
  const initials = member.username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        {rank && (
          <div className="text-lg font-bold text-muted-foreground w-8 text-center">
            #{rank}
          </div>
        )}
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium text-foreground">{member.username}</p>
          <p className="text-xs text-muted-foreground">Level {member.level}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right">
        {isLeaderboard ? (
          <>
            <div>
              <div className="flex items-center gap-1 font-bold text-secondary">
                <Zap className="w-4 h-4" />
                {member.weeklyEXP}
              </div>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-1 font-bold text-secondary">
                <Zap className="w-4 h-4" />
                {member.communityEXP}
              </div>
              <p className="text-xs text-muted-foreground">Community EXP</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
