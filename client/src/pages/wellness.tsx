import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMinutes } from "@/lib/utils";

export default function Wellness() {
  const { data: dailyQuote } = useQuery({
    queryKey: ['/api/quotes/daily'],
  });

  const { data: screenTime } = useQuery({
    queryKey: ['/api/screen-time/today'],
  });

  const wellnessTips = [
    {
      title: "20-20-20 Rule",
      description: "Every 20 minutes, look at something 20 feet away for 20 seconds",
      icon: "fas fa-eye",
      color: "text-blue-500",
    },
    {
      title: "Digital Sunset",
      description: "Stop using devices 1 hour before bedtime",
      icon: "fas fa-moon",
      color: "text-purple-500",
    },
    {
      title: "Mindful Mornings",
      description: "Avoid checking your phone for the first 30 minutes after waking",
      icon: "fas fa-sun",
      color: "text-yellow-500",
    },
    {
      title: "Movement Breaks",
      description: "Take a 5-minute walk every hour of screen time",
      icon: "fas fa-walking",
      color: "text-green-500",
    },
  ];

  const healthMetrics = [
    {
      label: "Sleep Quality",
      value: "Good",
      icon: "fas fa-bed",
      color: "text-green-500",
    },
    {
      label: "Stress Level",
      value: "Low",
      icon: "fas fa-heart",
      color: "text-blue-500",
    },
    {
      label: "Eye Strain",
      value: "Moderate",
      icon: "fas fa-eye",
      color: "text-yellow-500",
    },
    {
      label: "Posture",
      value: "Good",
      icon: "fas fa-user",
      color: "text-green-500",
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wellness</h1>
        <Button data-testid="button-wellness-assessment">
          <i className="fas fa-clipboard-check mr-2"></i>
          Take Assessment
        </Button>
      </div>

      {dailyQuote && (
        <Card className="bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <i className="fas fa-quote-left text-white/70 mt-1"></i>
              <div>
                <p className="italic mb-2 text-lg" data-testid="text-daily-quote">
                  "{dailyQuote.quote}"
                </p>
                <p className="text-sm opacity-80">— {dailyQuote.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                  <i className={`${metric.icon} ${metric.color}`}></i>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="font-semibold" data-testid={`text-${metric.label.toLowerCase().replace(' ', '-')}`}>
                    {metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wellness Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wellnessTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <i className={`${tip.icon} ${tip.color} text-sm`}></i>
                </div>
                <div>
                  <h4 className="font-medium mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Digital Detox Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-breathing-exercise"
            >
              <i className="fas fa-lung mr-2 text-blue-500"></i>
              5-Minute Breathing Exercise
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-stretching"
            >
              <i className="fas fa-child mr-2 text-green-500"></i>
              Desk Stretching Routine
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-meditation"
            >
              <i className="fas fa-om mr-2 text-purple-500"></i>
              Guided Meditation
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-walk"
            >
              <i className="fas fa-walking mr-2 text-orange-500"></i>
              Take a 10-Minute Walk
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              data-testid="button-journaling"
            >
              <i className="fas fa-pen mr-2 text-indigo-500"></i>
              Mindful Journaling
            </Button>
          </CardContent>
        </Card>
      </div>

      {screenTime && (
        <Card>
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-lightbulb text-primary text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Great Progress!</p>
                  <p className="text-xs text-muted-foreground">
                    You've maintained healthy screen time habits for the past week. Your focus sessions are improving your productivity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-exclamation-triangle text-accent text-xs"></i>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Evening Usage Alert</p>
                  <p className="text-xs text-muted-foreground">
                    Consider reducing screen time after 8 PM to improve your sleep quality. Try reading or meditation instead.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
