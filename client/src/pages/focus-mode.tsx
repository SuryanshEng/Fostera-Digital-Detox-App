import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatMinutes } from "@/lib/utils";

export default function FocusMode() {
  const [targetMinutes, setTargetMinutes] = useState(25);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activeSession } = useQuery({
    queryKey: ['/api/focus/active'],
  });

  const startFocusMutation = useMutation({
    mutationFn: async (data: { targetMinutes: number }) => {
      const response = await apiRequest('POST', '/api/focus/start', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Focus session started!",
        description: "Stay focused and minimize distractions.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/focus/active'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to start focus session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const endFocusMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest('POST', `/api/focus/end/${sessionId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Focus session completed!",
        description: "Great job staying focused!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/focus/active'] });
    },
  });

  const handleStartFocus = () => {
    startFocusMutation.mutate({ targetMinutes });
  };

  const handleEndFocus = () => {
    if (activeSession) {
      endFocusMutation.mutate(activeSession.id);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Focus Mode</h1>
        {activeSession && (
          <div className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium">
            Active Session
          </div>
        )}
      </div>

      {activeSession ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fas fa-clock text-primary"></i>
              Focus Session in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" data-testid="text-session-target">
                {formatMinutes(activeSession.targetMinutes)}
              </div>
              <p className="text-muted-foreground">Target Duration</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Started at</p>
              <p className="font-medium" data-testid="text-session-start">
                {new Date(activeSession.startTime).toLocaleTimeString()}
              </p>
            </div>

            {activeSession.blockedApps && activeSession.blockedApps.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Blocked Apps</h3>
                <div className="flex flex-wrap gap-2">
                  {activeSession.blockedApps.map((app, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-destructive/10 text-destructive rounded text-sm"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleEndFocus}
              disabled={endFocusMutation.isPending}
              className="w-full"
              variant="destructive"
              data-testid="button-end-focus"
            >
              End Focus Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Start a Focus Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(Number(e.target.value))}
                min={1}
                max={480}
                data-testid="input-focus-duration"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[15, 25, 45].map((duration) => (
                <Button
                  key={duration}
                  variant="outline"
                  onClick={() => setTargetMinutes(duration)}
                  data-testid={`button-preset-${duration}`}
                >
                  {duration}m
                </Button>
              ))}
            </div>

            <Button 
              onClick={handleStartFocus}
              disabled={startFocusMutation.isPending}
              className="w-full"
              data-testid="button-start-focus"
            >
              <i className="fas fa-bullseye mr-2"></i>
              Start Focus Session
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Focus Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-primary mt-0.5"></i>
                <span>Turn off notifications during focus sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-primary mt-0.5"></i>
                <span>Use the Pomodoro Technique (25-minute intervals)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-primary mt-0.5"></i>
                <span>Take regular breaks between sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-primary mt-0.5"></i>
                <span>Stay hydrated and maintain good posture</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-block-social"
            >
              <i className="fas fa-ban mr-2"></i>
              Block Social Media
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-enable-dnd"
            >
              <i className="fas fa-moon mr-2"></i>
              Enable Do Not Disturb
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-breathing-exercise"
            >
              <i className="fas fa-lung mr-2"></i>
              Breathing Exercise
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
