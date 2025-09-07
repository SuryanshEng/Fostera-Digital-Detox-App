import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 lg:hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-leaf text-primary-foreground text-sm"></i>
          </div>
          <h1 className="text-xl font-bold">Fostera</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          data-testid="mobile-menu-button"
        >
          <i className="fas fa-bars"></i>
        </Button>
      </div>
    </header>
  );
}
