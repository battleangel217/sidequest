'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoggedInNavbar } from '@/components/logged-in-navbar';
import { getCurrentUser } from '@/lib/auth';
import { User } from '@/lib/types';
import { Mail, Bell, Shield, LogOut, Moon, Sun, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme, mounted } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    taskApprovals: true,
    streakReminders: true,
    communityUpdates: true,
  });

  useEffect(() => {
    const initSettings = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      setUser(currentUser.data);
      setLoading(false);
    }
    initSettings();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LoggedInNavbar user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account information
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username</span>
                <span className="text-foreground">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">2026</span>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Control how you receive notifications
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="font-medium">Task approvals</span>
                <Button
                  size="sm"
                  variant={notificationSettings.taskApprovals ? 'default' : 'outline'}
                  onClick={() =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      taskApprovals: !prev.taskApprovals,
                    }))
                  }
                  className="gap-2"
                >
                  {notificationSettings.taskApprovals && <Check className="w-4 h-4" />}
                  {notificationSettings.taskApprovals ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="font-medium">Streak reminders</span>
                <Button
                  size="sm"
                  variant={notificationSettings.streakReminders ? 'default' : 'outline'}
                  onClick={() =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      streakReminders: !prev.streakReminders,
                    }))
                  }
                  className="gap-2"
                >
                  {notificationSettings.streakReminders && <Check className="w-4 h-4" />}
                  {notificationSettings.streakReminders ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="font-medium">Community updates</span>
                <Button
                  size="sm"
                  variant={notificationSettings.communityUpdates ? 'default' : 'outline'}
                  onClick={() =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      communityUpdates: !prev.communityUpdates,
                    }))
                  }
                  className="gap-2"
                >
                  {notificationSettings.communityUpdates && <Check className="w-4 h-4" />}
                  {notificationSettings.communityUpdates ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep your account secure
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <button className="w-full text-left p-3 hover:bg-muted rounded transition-colors">
                Change Password
              </button>
              <button className="w-full text-left p-3 hover:bg-muted rounded transition-colors">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left p-3 hover:bg-muted rounded transition-colors">
                Active Sessions
              </button>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Preferences</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="font-medium">Dark Mode</span>
                {mounted && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </Button>
                    <Button
                      size="sm"
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="font-medium">Email Digest</span>
                <select className="text-xs bg-background border border-border rounded px-2 py-1">
                  <option>Weekly</option>
                  <option>Daily</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <h3 className="text-lg font-bold text-destructive mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/50 hover:bg-destructive/5"
              >
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
