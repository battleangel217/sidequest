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
import { User } from '@/lib/types';
import { Plus, Search } from 'lucide-react';

export default function CommunitiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDesc, setNewCommunityDesc] = useState('');

  useEffect(() => {
    initializeStorage();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading communities...</p>
      </div>
    );
  }

  const userCommunities = Object.values(mockCommunities).filter((c) =>
    c.members.includes(user.id)
  );

  const otherCommunities = Object.values(mockCommunities).filter(
    (c) => !c.members.includes(user.id)
  );

  const filteredOther = otherCommunities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                // In a real app, this would create the community
                setCreateOpen(false);
              }}
              disabled={!newCommunityName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
