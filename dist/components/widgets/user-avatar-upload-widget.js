import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToggleDarkModeSwitch } from "../core/dark-mode-switch";
import { SettingsWidget } from "../core/settings-widget";
import { Moon, User } from "lucide-react";
import { UserAvatarForm } from "../core/user-avatar-form";
import Pocketbase from "pocketbase";
export function UserAvatarUploadWidget({ user, pb, updateUser }) {
    return (_jsx(SettingsWidget, { title: "Profile Picture", description: "Update your profile picture", icon: _jsx(User, { size: 18 }), children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx(UserAvatarForm, { user: user, pb: pb, updateUser: updateUser, avatarClassName: "w-24 h-24 border-3 border-accent shadow-lg" }), _jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Click to upload a new profile picture. Recommended aspect ratio is 1:1 and maximum file size is 5MB." })] }) }));
}
