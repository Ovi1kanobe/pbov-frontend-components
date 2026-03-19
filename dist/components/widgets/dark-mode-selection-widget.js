import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ToggleDarkModeSwitch } from "../core/dark-mode-switch";
import { SettingsWidget } from "../core/settings-widget";
import { Moon } from "lucide-react";
export function DarkModeSelectionWidget({ isDarkMode, setDarkMode }) {
    return (_jsx(SettingsWidget, { title: "Dark Mode", description: "Toggle between light and dark appearance", icon: _jsx(Moon, { size: 18 }), children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-lg", children: [_jsx("span", { className: "text-sm font-medium", children: "Enable Dark Mode" }), _jsx(ToggleDarkModeSwitch, { isDarkMode: isDarkMode, setDarkMode: setDarkMode })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Dark mode reduces eye strain and saves battery life on devices with OLED screens" })] }) }));
}
