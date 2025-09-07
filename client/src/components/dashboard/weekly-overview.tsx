import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMinutes, getClassificationColor, getDayLabels } from "@/lib/utils";

export default function WeeklyOverview() {
  const { data: weeklyData } = useQuery({
    queryKey: ['/api/screen-time/weekly'],
  });

  const dayLabels = getDayLabels();

  // Mock data for demonstration if API doesn't return data
  const mockWeeklyData = [
    { totalMinutes: 108, classification: "blue" },    // 1.8h - Mon
    { totalMinutes: 144, classification: "yellow" },  // 2.4h - Tue
    { totalMinutes: 138, classification: "yellow" },  // 2.3h - Wed
    { totalMinutes: 192, classification: "orange" },  // 3.2h - Thu
    { totalMinutes: 246, classification: "purple" },  // 4.1h - Fri
    { totalMinutes: 174, classification: "orange" },  // 2.9h - Sat
    { totalMinutes: 150, classification: "yellow" },  // 2.5h - Today
  ];

  const displayData = weeklyData && weeklyData.length > 0 ? weeklyData : mockWeeklyData;
  const weeklyAverage = displayData.reduce((sum, day) => sum + day.totalMinutes, 0) / displayData.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl mb-4 md:mb-0">Weekly Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm">Week</Button>
            <Button variant="ghost" size="sm">Month</Button>
            <Button variant="ghost" size="sm">Year</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekly Chart */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {displayData.map((day, index) => {
            const height = Math.max((day.totalMinutes / 300) * 100, 10); // Scale to max 5 hours
            const isToday = index === displayData.length - 1;
            
            return (
              <div key={index} className="text-center">
                <p className={`text-xs mb-2 ${isToday ? 'font-medium' : 'text-muted-foreground'}`}>
                  {isToday ? 'Today' : dayLabels[index]}
                </p>
                <div className="h-20 bg-muted rounded flex items-end justify-center pb-2">
                  <div 
                    className={`w-full max-w-6 ${getClassificationColor(day.classification)} rounded-t ${isToday ? 'animate-pulse' : ''}`}
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 font-medium" data-testid={`text-weekly-day-${index}`}>
                  {formatMinutes(day.totalMinutes)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Weekly Average</p>
            <p className="text-2xl font-bold" data-testid="text-weekly-average">
              {formatMinutes(Math.round(weeklyAverage))}
            </p>
            <p className="text-sm text-green-600">↓ 12% from last week</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
