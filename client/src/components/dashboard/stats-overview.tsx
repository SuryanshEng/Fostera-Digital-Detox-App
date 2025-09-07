import { formatMinutes } from "@/lib/utils";
import type { ScreenTimeEntry } from "@shared/schema";

interface StatsOverviewProps {
  screenTime: ScreenTimeEntry;
}

export default function StatsOverview({ screenTime }: StatsOverviewProps) {
  const stats = [
    {
      label: "Today's Screen Time",
      value: formatMinutes(screenTime.totalMinutes),
      icon: "fas fa-clock",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "↓ 15% from yesterday",
      changeColor: "text-green-600",
    },
    {
      label: "Phone Pickups",
      value: screenTime.pickups.toString(),
      icon: "fas fa-mobile-alt",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "↓ 8 from yesterday",
      changeColor: "text-green-600",
    },
    {
      label: "Focus Time",
      value: formatMinutes(screenTime.focusMinutes),
      icon: "fas fa-bullseye",
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "↑ 23% from yesterday",
      changeColor: "text-green-600",
    },
    {
      label: "Day Streak",
      value: "12",
      icon: "fas fa-trophy",
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "Personal best!",
      changeColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <i className={`${stat.icon} ${stat.color}`}></i>
            </div>
            <span className={`text-2xl font-bold ${stat.color}`} data-testid={`text-stat-${index}`}>
              {stat.value}
            </span>
          </div>
          <h3 className="font-medium text-muted-foreground">{stat.label}</h3>
          <p className={`text-sm ${stat.changeColor} mt-1`}>{stat.change}</p>
        </div>
      ))}
    </div>
  );
}
