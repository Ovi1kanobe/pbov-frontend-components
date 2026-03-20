import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, Crown, Mail, User } from "lucide-react";
import { SettingsWidget } from "../core/settings-widget";
import { UserAvatar } from "../core/user-avatar";
import { Badge } from "../ui/badge";
export function UserProfileDisplayWidget({ user, pb }) {
    return (_jsx(SettingsWidget, { title: "Profile Overview", description: "Your current profile information and status", icon: _jsx(User, { size: 18 }), children: _jsxs("div", { className: "flex items-center gap-4 p-4 bg-muted/50 rounded-lg", children: [_jsx(UserAvatar, { user: user, className: "w-24 h-24 shadow-lg", pb: pb }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-lg", children: user?.name || "Unknown User" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Mail, { size: 14, className: "text-muted-foreground" }), _jsx("span", { className: "text-sm text-muted-foreground", children: user?.email })] }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [_jsx(Crown, { size: 12, className: "mr-1" }), user?.role || "User"] }), user?.created && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx(Calendar, { size: 12, className: "mr-1" }), "Member since ", new Date(user.created).getFullYear()] }))] })] })] }) }));
}
