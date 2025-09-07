import { useQuery } from "@tanstack/react-query";
import WelcomeHeader from "@/components/dashboard/welcome-header";
import StatsOverview from "@/components/dashboard/stats-overview";
import ScreenTimeChart from "@/components/dashboard/screen-time-chart";
import AppUsageBreakdown from "@/components/dashboard/app-usage-breakdown";
import SidePanel from "@/components/dashboard/side-panel";
import WeeklyOverview from "@/components/dashboard/weekly-overview";

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['/api/user/current'],
  });

  const { data: screenTime } = useQuery({
    queryKey: ['/api/screen-time/today'],
  });

  const { data: dailyQuote } = useQuery({
    queryKey: ['/api/quotes/daily'],
  });

  if (!user || !screenTime || !dailyQuote) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-muted rounded-xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-20 lg:pb-6">
      <WelcomeHeader user={user} screenTime={screenTime} quote={dailyQuote} />
      <StatsOverview screenTime={screenTime} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ScreenTimeChart screenTime={screenTime} />
          <AppUsageBreakdown />
        </div>
        <SidePanel />
      </div>
      
      <WeeklyOverview />
    </div>
  );
}
