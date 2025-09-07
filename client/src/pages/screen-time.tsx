import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes, getClassificationColor, getClassificationName } from "@/lib/utils";

export default function ScreenTime() {
  const { data: screenTime } = useQuery({
    queryKey: ['/api/screen-time/today'],
  });

  const { data: weeklyData } = useQuery({
    queryKey: ['/api/screen-time/weekly'],
  });

  if (!screenTime) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Screen Time</h1>
        <div className={`px-4 py-2 rounded-full font-medium ${getClassificationColor(screenTime.classification)}`}>
          {getClassificationName(screenTime.classification)} Zone
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-daily-usage">
              {formatMinutes(screenTime.totalMinutes)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Goal: {formatMinutes(240)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Phone Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pickups">
              {screenTime.pickups}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-focus-time">
              {formatMinutes(screenTime.focusMinutes)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In focus sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyData ? (
            <div className="space-y-4">
              {weeklyData.map((entry, index) => {
                const date = new Date(entry.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div key={entry.id} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{dayName}</div>
                    <div className="flex-1 bg-muted rounded-full h-2 relative">
                      <div 
                        className={`h-2 rounded-full ${getClassificationColor(entry.classification)}`}
                        style={{ width: `${Math.min((entry.totalMinutes / 480) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-sm text-right" data-testid={`text-weekly-usage-${index}`}>
                      {formatMinutes(entry.totalMinutes)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Loading weekly data...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
