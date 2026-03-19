import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ovi1kanobe/pbov";
import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SettingsWidget({ 
  title, 
  description, 
  children, 
  icon,
  className = ""
}: SettingsSectionProps) {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}