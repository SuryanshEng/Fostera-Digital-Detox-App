import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: "fas fa-chart-pie" },
  { name: "Screen Time", href: "/screen-time", icon: "fas fa-clock" },
  { name: "Focus", href: "/focus-mode", icon: "fas fa-bullseye" },
  { name: "Wellness", href: "/wellness", icon: "fas fa-heart" },
  { name: "Settings", href: "/settings", icon: "fas fa-cog" },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="grid grid-cols-5 text-center">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "p-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <i className={`${item.icon} block mb-1`}></i>
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
