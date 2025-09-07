import { getGreeting, getClassificationColor, getClassificationName, formatMinutes } from "@/lib/utils";
import type { User, ScreenTimeEntry, DailyQuote } from "@shared/schema";

interface WelcomeHeaderProps {
  user: User;
  screenTime: ScreenTimeEntry;
  quote: DailyQuote;
}

export default function WelcomeHeader({ user, screenTime, quote }: WelcomeHeaderProps) {
  const greeting = getGreeting();

  return (
    <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {greeting}, {user.firstName}! 🌅
          </h2>
          <p className="opacity-90 mb-4">Today is a new opportunity to build healthier digital habits</p>
          
          {/* Daily Quote */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <i className="fas fa-quote-left text-white/70 mt-1"></i>
              <div>
                <p className="italic mb-2" data-testid="text-welcome-quote">
                  "{quote.quote}"
                </p>
                <p className="text-sm opacity-80">— {quote.author}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Current Classification Badge */}
        <div className="flex-shrink-0">
          <div className="text-center">
            <p className="text-sm opacity-80 mb-2">Your Current Status</p>
            <div className={`${getClassificationColor(screenTime.classification)} px-6 py-3 rounded-full font-bold text-lg`} data-testid="badge-current-classification">
              <i className="fas fa-flag mr-2"></i>
              {getClassificationName(screenTime.classification)} Zone
            </div>
            <p className="text-xs opacity-80 mt-1" data-testid="text-today-screen-time">
              {formatMinutes(screenTime.totalMinutes)} today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
