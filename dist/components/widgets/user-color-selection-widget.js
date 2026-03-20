import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SettingsWidget } from "../core/settings-widget";
import { Palette } from "lucide-react";
import { ColorPicker } from "../ui/color-picker";
export function UserColorSelectionWidget({ currentColor, setCurrentColor, onError }) {
    function handleColorChange(newColor) {
        if (!newColor) {
            onError("Invalid color format. Please enter a valid color string.");
            return;
        }
        setCurrentColor(newColor);
    }
    return (_jsx(SettingsWidget, { title: "Profile Color", description: "Choose your personal color scheme for your profile", icon: _jsx(Palette, { size: 18 }), children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx(ColorPicker, { value: currentColor, onChange: handleColorChange, className: "w-50" }), _jsx("p", { className: "text-xs text-muted-foreground text-center", children: "This color will be used to personalize your profile." })] }) }));
}
