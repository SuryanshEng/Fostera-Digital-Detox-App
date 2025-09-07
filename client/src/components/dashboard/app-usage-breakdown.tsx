import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes } from "@/lib/utils";

export default function AppUsageBreakdown() {
  const { data: appUsage } = useQuery({
    queryKey: ['/api/app-usage/today'],
  });

  if (!appUsage || appUsage.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">App Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <i className="fas fa-mobile-alt text-4xl mb-4 opacity-50"></i>
            <p>No app usage data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMinutes = appUsage.reduce((sum, app) => sum + app.minutes, 0);

  const getAppIconColor = (appName: string) => {
    const colors: Record<string, string> = {
      'Facebook': 'bg-blue-500',
      'Instagram': 'bg-pink-500',
      'YouTube': 'bg-red-500',
      'WhatsApp': 'bg-green-500',
      'Games': 'bg-purple-500',
    };
    return colors[appName] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">App Usage Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appUsage.map((app, index) => {
            const percentage = totalMinutes > 0 ? (app.minutes / totalMinutes) * 100 : 0;
            
            return (
              <div key={app.id} className="flex items-center gap-4">
                <div className={`w-10 h-10 ${getAppIconColor(app.appName)} rounded-lg flex items-center justify-center`}>
                  <i className={`${app.appIcon} text-white`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{app.appName}</span>
                    <span className="text-sm text-muted-foreground" data-testid={`text-app-usage-${index}`}>
                      {formatMinutes(app.minutes)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${getAppIconColor(app.appName)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
