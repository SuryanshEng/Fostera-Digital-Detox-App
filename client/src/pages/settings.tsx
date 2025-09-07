import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const { data: user } = useQuery({
    queryKey: ['/api/user/current'],
  });

  const [dailyGoal, setDailyGoal] = useState(240); // 4 hours default

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest('PATCH', '/api/settings', updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
    onError: () => {
      toast({
        title: "Failed to update settings",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (key: string, value: boolean) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  if (!settings || !user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-32"></div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-20 lg:pb-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-user text-primary-foreground text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                  {user.email}
                </p>
                {user.isPremium && (
                  <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded mt-1 inline-block">
                    Premium Member
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily-goal">Daily Screen Time Goal (hours)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="daily-goal"
                  type="number"
                  value={dailyGoal / 60}
                  onChange={(e) => setDailyGoal(Number(e.target.value) * 60)}
                  min={1}
                  max={12}
                  step={0.5}
                  className="w-20"
                  data-testid="input-daily-goal"
                />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive general app notifications
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleToggle('notifications', checked)}
                data-testid="switch-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Usage Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when approaching daily limits
                </p>
              </div>
              <Switch
                checked={settings.usageAlerts}
                onCheckedChange={(checked) => handleToggle('usageAlerts', checked)}
                data-testid="switch-usage-alerts"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Focus Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Reminders to start focus sessions
                </p>
              </div>
              <Switch
                checked={settings.focusReminders}
                onCheckedChange={(checked) => handleToggle('focusReminders', checked)}
                data-testid="switch-focus-reminders"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly usage summaries
                </p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleToggle('weeklyReports', checked)}
                data-testid="switch-weekly-reports"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme for better night viewing
                </p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleToggle('darkMode', checked)}
                data-testid="switch-dark-mode"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" data-testid="button-export-data">
              <i className="fas fa-download mr-2"></i>
              Export My Data
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-privacy-policy">
              <i className="fas fa-shield-alt mr-2"></i>
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-terms">
              <i className="fas fa-file-contract mr-2"></i>
              Terms of Service
            </Button>
            <Button variant="destructive" className="w-full justify-start" data-testid="button-delete-account">
              <i className="fas fa-trash mr-2"></i>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Fostera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-leaf text-primary-foreground text-2xl"></i>
            </div>
            <h3 className="font-semibold text-lg">Fostera v1.0.0</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your digital wellness companion. Fostera helps you build healthier relationships with technology 
              through mindful screen time management and personalized insights.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" size="sm" data-testid="button-support">
                <i className="fas fa-headset mr-2"></i>
                Support
              </Button>
              <Button variant="outline" size="sm" data-testid="button-feedback">
                <i className="fas fa-comment mr-2"></i>
                Feedback
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
