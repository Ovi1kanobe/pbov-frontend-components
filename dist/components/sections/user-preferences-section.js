import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Pocketbase from "pocketbase";
import { toast } from "sonner";
import { SettingsWidget } from "../core/settings-widget";
import { DarkModeSelectionWidget } from "../widgets/dark-mode-selection-widget";
import { ThemeSelectionWidget } from "../widgets/theme-selection-widget";
import { UserAvatarUploadWidget } from "../widgets/user-avatar-upload-widget";
import { UserColorSelectionWidget } from "../widgets/user-color-selection-widget";
import { UserProfileDisplayWidget } from "../widgets/user-profile-display-widget";
import { useDebounce } from "../../hooks/useDebounce";
export function UserPreferencesSection({ user, pb, updateUser, preferences, updatePreferences, isDarkMode, setDarkMode, availableThemes, theme, setTheme, onError, }) {
    const handleError = onError ?? ((message) => toast.error(message));
    // local color state, debounced so dragging the picker doesn't spam updatePreferences
    const [localColor, setLocalColor] = useState(preferences?.color || "#000000");
    const debouncedColor = useDebounce(localColor, 300);
    // sync local state when preferences change from outside
    useEffect(() => {
        if (preferences?.color && preferences.color !== localColor) {
            setLocalColor(preferences.color);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preferences?.color]);
    // push the debounced color once it settles
    useEffect(() => {
        if (debouncedColor && debouncedColor !== preferences?.color) {
            updatePreferences({ color: debouncedColor });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedColor]);
    if (!user) {
        return (_jsx(SettingsWidget, { title: "User Preferences", description: "Please log in to view and edit your preferences.", icon: _jsx(User, { size: 18 }), children: _jsx("p", { className: "text-sm text-muted-foreground", children: "You need to be logged in to access your preferences." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(UserProfileDisplayWidget, { user: user, pb: pb }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(UserAvatarUploadWidget, { user: user, pb: pb, updateUser: updateUser }), _jsx(UserColorSelectionWidget, { currentColor: localColor, setCurrentColor: setLocalColor, onError: handleError })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(ThemeSelectionWidget, { theme: theme, setTheme: setTheme, availableThemes: availableThemes }), _jsx(DarkModeSelectionWidget, { isDarkMode: isDarkMode, setDarkMode: setDarkMode })] })] }));
}
