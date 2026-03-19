import { ToggleDarkModeSwitch } from "../core/dark-mode-switch";
import { Widget1 } from "../core/widget-type-1";
import { Moon } from "lucide-react";

type DarkModeSelectionWidgetProps = {
    isDarkMode: boolean;
    setDarkMode: (isDarkMode: boolean) => void;
}

export function DarkModeSelectionWidget({ isDarkMode, setDarkMode }: DarkModeSelectionWidgetProps) {

    return (
        <Widget1
            title="Dark Mode"
            description="Toggle between light and dark appearance"
            icon={<Moon size={18} />}
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Enable Dark Mode</span>
                    <ToggleDarkModeSwitch isDarkMode={isDarkMode} setDarkMode={setDarkMode} />
                </div>
                <p className="text-xs text-muted-foreground">
                    Dark mode reduces eye strain and saves battery life on devices with OLED screens
                </p>
            </div>
        </Widget1>
    );
}