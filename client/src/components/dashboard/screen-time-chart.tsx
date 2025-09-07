import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMinutes } from "@/lib/utils";
import type { ScreenTimeEntry } from "@shared/schema";

interface ScreenTimeChartProps {
  screenTime: ScreenTimeEntry;
}

export default function ScreenTimeChart({ screenTime }: ScreenTimeChartProps) {
  const dailyGoalMinutes = 240; // 4 hours
  const progressPercentage = Math.min((screenTime.totalMinutes / dailyGoalMinutes) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const progressItems = [
    {
      label: "Screen Time",
      current: `${formatMinutes(screenTime.totalMinutes)} / ${formatMinutes(dailyGoalMinutes)}`,
      percentage: progressPercentage,
      color: "bg-accent",
    },
    {
      label: "Focus Sessions",
      current: "3 / 5",
      percentage: 60,
      color: "bg-primary",
    },
    {
      label: "App Blocks",
      current: "8 / 10",
      percentage: 80,
      color: "bg-destructive",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Today's Progress</CardTitle>
          <Select defaultValue="today">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Progress Circle */}
          <div className="relative w-48 h-48">
            <svg className="progress-circle w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="hsl(var(--muted))" 
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="hsl(var(--accent))" 
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold" data-testid="text-progress-percentage">
                {Math.round(progressPercentage)}%
              </span>
              <span className="text-sm text-muted-foreground">of daily goal</span>
            </div>
          </div>

          {/* Progress Details */}
          <div className="flex-1 space-y-4 w-full">
            {progressItems.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-muted-foreground" data-testid={`text-progress-${index}`}>
                    {item.current}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
