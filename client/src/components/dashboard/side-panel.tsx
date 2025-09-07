import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const classifications = [
  { name: "Excellent (0-2h)", color: "classification-blue", key: "blue" },
  { name: "Good (2-3h)", color: "classification-yellow", key: "yellow" },
  { name: "Fair (3-4h)", color: "classification-orange", key: "orange" },
  { name: "Warning (4-6h)", color: "classification-purple", key: "purple" },
  { name: "Concerning (6-8h)", color: "classification-red", key: "red" },
  { name: "Critical (8-12h)", color: "classification-brown", key: "brown" },
  { name: "Emergency (12h+)", color: "classification-flag", key: "flag" },
];

export default function SidePanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const startFocusMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/focus/start', { targetMinutes: 25 });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Focus session started!",
        description: "25-minute focus session is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/focus/active'] });
      setLocation('/focus-mode');
    },
    onError: () => {
      toast({
        title: "Failed to start focus session",
        description: "You may already have an active session.",
        variant: "destructive",
      });
    },
  });

  const insights = [
    {
      type: "success",
      title: "Great Progress!",
      description: "You've reduced your screen time by 15% this week. Keep it up!",
      icon: "fas fa-lightbulb",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20",
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
    },
    {
      type: "warning",
      title: "Peak Usage Alert",
      description: "Your usage spikes between 8-10 PM. Consider setting a reminder.",
      icon: "fas fa-exclamation-triangle",
      bgColor: "bg-accent/5",
      borderColor: "border-accent/20",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
    },
    {
      type: "suggestion",
      title: "Goal Suggestion",
      description: "Try reducing Instagram usage by 10 minutes tomorrow.",
      icon: "fas fa-target",
      bgColor: "bg-muted",
      borderColor: "border-muted",
      iconBg: "bg-muted-foreground/20",
      iconColor: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Classification System */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Classifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classifications.map((classification, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`${classification.color} w-4 h-4 rounded-full flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{classification.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {classification.key}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => startFocusMutation.mutate()}
              disabled={startFocusMutation.isPending}
              data-testid="button-start-focus-mode"
            >
              <i className="fas fa-bullseye mr-2"></i>
              Start Focus Mode
            </Button>

            <Button 
              variant="secondary" 
              className="w-full"
              data-testid="button-block-social-media"
            >
              <i className="fas fa-ban mr-2"></i>
              Block Social Media
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setLocation('/screen-time')}
              data-testid="button-view-insights"
            >
              <i className="fas fa-chart-line mr-2"></i>
              View Insights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`${insight.bgColor} p-4 rounded-lg border ${insight.borderColor}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${insight.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <i className={`${insight.icon} ${insight.iconColor} text-xs`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" data-testid={`text-insight-title-${index}`}>
                      {insight.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
