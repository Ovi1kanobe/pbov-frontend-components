import { ToggleDarkModeSwitch } from "../core/dark-mode-switch";
import { SettingsWidget } from "../core/settings-widget";
import { Moon, User } from "lucide-react";
import { UserAvatarForm, type AvatarUser } from "../core/user-avatar-form";
import Pocketbase from "pocketbase";

type UserAvatarUploadWidgetProps = {
    user: AvatarUser;
    pb: Pocketbase;
    updateUser: (data: { avatar: File }) => void;
}

export function UserAvatarUploadWidget({ user, pb, updateUser }: UserAvatarUploadWidgetProps) {

    return (
        <SettingsWidget
            title="Profile Picture"
            description="Update your profile picture"
            icon={<User size={18} />}
        >
            <div className="flex flex-col items-center gap-4">
                <UserAvatarForm 
                    user={user} 
                    pb={pb} 
                    updateUser={updateUser} 
                    avatarClassName="w-24 h-24 border-3 shadow-lg" 
                />
                <p className="text-xs text-muted-foreground text-center">
                    Click to upload a new profile picture. Recommended aspect ratio is 1:1 and maximum file size is 5MB.
                </p>
            </div>
        </SettingsWidget>
    );
}