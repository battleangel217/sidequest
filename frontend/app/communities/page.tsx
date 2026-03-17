'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LoggedInNavbar } from '@/components/logged-in-navbar';
import { CommunityCard } from '@/components/community/community-card';
import { getCurrentUser, initializeStorage } from '@/lib/auth';
import { mockCommunities } from '@/lib/data';
import { AuthUser, User, Community } from '@/lib/types';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { json } from 'stream/consumers';

export default function CommunitiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDesc, setNewCommunityDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommunities = async () => {
      initializeStorage();
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      
      setUser(currentUser.data);
      setUserData(currentUser);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/`, {
          headers: {
            "Authorization": `Bearer ${currentUser.access}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Transform API data to match frontend types
          const mappedCommunities: Community[] = data.map((c: any) => ({
            ...c,
            id: String(c.id),
            isPrivate: c.is_private,
            members: c.members
              ? c.members.map((m: any) => ({
                  userId: String(m.user.id),
                  username: m.user.username,
                  level: m.user.level,
                  communityEXP: m.community_exp || 0,
                  weeklyEXP: m.weekly_exp || 0,
                  joinedDate: m.joined_at,
                }))
              : [],
            created: c.created_at,
          }));
          setCommunities(mappedCommunities);
        }
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading communities...</p>
      </div>
    );
  }

  const userCommunities = communities.filter((c) =>
    c.members.some((m) => m.userId === String(user.id))
  );

  const otherCommunities = communities.filter(
    (c) => !c.members.some((m) => m.userId === String(user.id))
  );

  const filteredOther = otherCommunities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCommunity = async () => {
    const data = {
      "name": newCommunityName,
      "description": newCommunityDesc,
      "is_private": isPrivate
    }

    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/`,
        {
          headers: {
            "Content-Type":"application/json",
            "Authorization":`Bearer ${userData?.access}`
          },
          method: "POST",
          body: JSON.stringify(data)
        }
      );

      if (!response.ok){
        throw new Error("Mhmmm");
      }

      const community = await response.json();
      router.push(`/community/${community.id}`);
      toast({
        title: 'Community created',
        description: 'Share link to friends to grow your community'
      });


    }catch (error){
      const message = error instanceof Error ? error.message : 'Server Error';
      toast({
        title: 'Failed to Create',
        description: message,
        variant: 'destructive'
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Communities</h1>
              <p className="text-muted-foreground">Find and join communities</p>
            </div>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>
        </div>

        {/* Your Communities */}
        {userCommunities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Communities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </div>
        )}

        {/* Discover Communities */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Discover Communities</h2>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredOther.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No communities found</p>
              <Button onClick={() => setCreateOpen(true)}>
                Create the first one
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOther.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Community Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
            <DialogDescription>
              Start a new community and invite others to join
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Community Name
              </label>
              <Input
                placeholder="e.g., Morning Code Challenge"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                placeholder="What is this community about?"
                value={newCommunityDesc}
                onChange={(e) => setNewCommunityDesc(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Visibility
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="accent-primary"
                  />
                  Public (Anyone can find and join)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="accent-primary"
                  />
                  Private (Invite only)
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCreateCommunity();
                // In a real app, this would create the community
                setCreateOpen(false);
              }}
              disabled={!newCommunityName.trim() || !newCommunityDesc.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
