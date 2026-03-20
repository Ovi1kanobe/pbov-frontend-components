import { Button } from "@ovi1kanobe/pbov";
import { Card } from "@ovi1kanobe/pbov";
import { 
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  description: string;
  requiresManagerRole?: boolean;
  authorizedRoles?: string[];
}

interface SettingsNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  navigationItems: NavigationItem[];
  userRole: string;
}


export function SettingsNavigation({ activeSection, onSectionChange, navigationItems, userRole }: SettingsNavigationProps) {

  const filteredItems = navigationItems.filter(item => 
    !item.authorizedRoles || (item.authorizedRoles && item.authorizedRoles.includes(userRole))
  );

  return (
    <Card className="p-4 h-fit sticky top-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-primary" />
          <h3 className="font-semibold text-sm">Settings</h3>
        </div>
        
        {filteredItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={`w-full justify-start h-auto p-3 ${
              activeSection === item.id 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-muted/50"
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            <div className="flex items-start gap-3 w-full">
              <div className={`shrink-0 ${
                activeSection === item.id ? "text-primary-foreground" : "text-muted-foreground"
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <p className={`text-xs mt-1 ${
                  activeSection === item.id 
                    ? "text-primary-foreground/80" 
                    : "text-muted-foreground"
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}