'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Notification } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [respondingId, setRespondingId] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      const currentUser = getCurrentUser();

      if (!currentUser) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/`, {
          headers: {
            'Authorization': `Bearer ${currentUser.access}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const sorted = data.sort((a: Notification, b: Notification) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setNotifications(sorted);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access}`,
        },
        body: JSON.stringify({ id, type: 'read' }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access}`,
        },
        body: JSON.stringify({ type: 'read_all' }),
      });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleInviteResponse = async (notificationId: number, action: 'accept' | 'reject') => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    setRespondingId(notificationId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invite/respond/${notificationId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to respond to invite');
      }

      const data = await response.json();

      // Mark notification as read and update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );

      toast({
        title: action === 'accept' ? '🎉 Invite Accepted!' : 'Invite Declined',
        description: data.message,
      });

      if (action === 'accept') {
        // Optionally redirect to the community
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification?.related_id) {
          router.push(`/community/${notification.related_id}`);
        }
      }
    } catch (error: any) {
      console.error('Failed to respond to invite:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to respond to invite. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRespondingId(null);
    }
  };

  const isInvite = (notification: Notification) =>
    notification.type === 'invite' && !notification.is_read;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="absolute top-0 right-0 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-border transition-colors ${
                  !notification.is_read ? 'bg-primary/5' : ''
                }`}
              >
                <div
                  onClick={() => { if (!isInvite(notification)) markAsRead(notification.id); }}
                  className={`cursor-pointer hover:bg-muted/50 rounded -m-1 p-1 ${isInvite(notification) ? 'cursor-default' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/50 mt-2">
                        {notification.created_at
                          ? new Date(notification.created_at).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                    {!notification.is_read && !isInvite(notification) && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Accept / Reject buttons for invite notifications */}
                {isInvite(notification) && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInviteResponse(notification.id, 'accept');
                      }}
                      disabled={respondingId === notification.id}
                      className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      {respondingId === notification.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accept
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInviteResponse(notification.id, 'reject');
                      }}
                      disabled={respondingId === notification.id}
                      className="flex-1 h-8 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 text-xs"
                    >
                      {respondingId === notification.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Decline
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
