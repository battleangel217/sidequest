'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Lock, ArrowRight } from 'lucide-react';
import { Community } from '@/lib/types';

interface CommunityCardProps {
  community: Community;
  userRank?: number;
}

export function CommunityCard({ community, userRank }: CommunityCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all hover:border-primary/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground mb-2">{community.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
        </div>
        <Badge variant="outline" className="ml-2 whitespace-nowrap">
          <Lock className="w-3 h-3 mr-1" />
          Invite
        </Badge>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-border mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{community.members.length} members</span>
        </div>
        {userRank && (
          <div className="text-sm font-medium text-primary">
            Rank #{userRank}
          </div>
        )}
      </div>

      <Link href={`/community/${community.id}`}>
        <Button className="w-full" variant="default">
          Enter Community
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </Card>
  );
}
