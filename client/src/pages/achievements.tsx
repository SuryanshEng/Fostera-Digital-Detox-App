import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Achievements() {
  const { data: achievements } = useQuery({
    queryKey: ['/api/achievements'],
  });

  const { data: screenTime } = useQuery({
    queryKey: ['/api/screen-time/today'],
  });

  const upcomingGoals = [
    {
      title: "Focus Master",
      description: "Complete 20 focus sessions",
      progress: 12,
      target: 20,
      icon: "fas fa-bullseye",
      color: "text-blue-500",
    },
    {
      title: "Digital Minimalist",
      description: "Stay under 2 hours for 7 days",
      progress: 3,
      target: 7,
      icon: "fas fa-leaf",
      color: "text-green-500",
    },
    {
      title: "Streak Champion",
      description: "Maintain 30-day healthy habits streak",
      progress: 12,
      target: 30,
      icon: "fas fa-fire",
      color: "text-orange-500",
    },
    {
      title: "Wellness Warrior",
      description: "Complete 15 wellness activities",
      progress: 8,
      target: 15,
      icon: "fas fa-heart",
      color: "text-red-500",
    },
  ];

  const achievementCategories = [
    { name: "Screen Time", count: 5, icon: "fas fa-clock" },
    { name: "Focus", count: 3, icon: "fas fa-bullseye" },
    { name: "Wellness", count: 4, icon: "fas fa-heart" },
    { name: "Streaks", count: 2, icon: "fas fa-fire" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary" data-testid="text-total-achievements">
            {achievements?.length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Unlocked</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievementCategories.map((category, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <i className={`${category.icon} text-primary`}></i>
              </div>
              <div className="font-semibold" data-testid={`text-${category.name.toLowerCase()}-count`}>
                {category.count}
              </div>
              <div className="text-sm text-muted-foreground">{category.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements && achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-trophy text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold" data-testid={`text-achievement-${achievement.id}`}>
                      {achievement.achievementName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {achievement.achievementType}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <i className="fas fa-trophy text-4xl mb-4 opacity-50"></i>
              <p>No achievements unlocked yet.</p>
              <p className="text-sm">Keep using Fostera to earn your first achievement!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Goals in Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <i className={`${goal.icon} ${goal.color} text-sm`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium" data-testid={`text-goal-progress-${index}`}>
                    {goal.progress}/{goal.target}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((goal.progress / goal.target) * 100)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
