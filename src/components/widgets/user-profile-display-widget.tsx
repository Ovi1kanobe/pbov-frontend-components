import { Calendar, Crown, Mail, User } from "lucide-react";
import { SettingsWidget } from "../core/settings-widget";
import { UserAvatar } from "../core/user-avatar";
import { Badge } from "../ui/badge";

type UserProfileDisplayWidgetProps = {
    user: {
        id: string;
        name?: string;
        email?: string;
        role?: string;
        created?: string;
        avatar?: string;
    };
    pb: any; // Replace with actual Pocketbase type if available
}

export function UserProfileDisplayWidget({ user, pb }: UserProfileDisplayWidgetProps) {
    return (
        <SettingsWidget
        title="Profile Overview"
        description="Your current profile information and status"
        icon={<User size={18} />}
      >
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <UserAvatar
            user={user}
            className="w-24 h-24 shadow-lg"
            pb={pb}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {user?.name || "Unknown User"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Mail size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                <Crown size={12} className="mr-1" />
                {user?.role || "User"}
              </Badge>
              {user?.created && (
                <Badge variant="outline" className="text-xs">
                  <Calendar size={12} className="mr-1" />
                  Member since {new Date(user.created).getFullYear()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SettingsWidget>

    )
}