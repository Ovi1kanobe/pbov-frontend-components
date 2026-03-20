import { SettingsWidget } from "../core/settings-widget";
import { Palette } from "lucide-react";
import { ColorPicker } from "../ui/color-picker";

type UserColorSelectionWidgetProps = {
    currentColor: string;
    setCurrentColor: (currentColor: string) => void;
    onError: (errorMessage: string) => void;
}

export function UserColorSelectionWidget({ currentColor, setCurrentColor, onError }: UserColorSelectionWidgetProps) {
    function handleColorChange(newColor: string) {
        if (!newColor) {
            onError("Invalid color format. Please enter a valid color string.");
            return;
        }
        setCurrentColor(newColor);
    }
    return (
        <SettingsWidget
            title="Profile Color"
            description="Choose your personal color scheme for your profile"
            icon={<Palette size={18} />}
        >
            <div className="flex flex-col items-center gap-4">
                <ColorPicker
                    value={currentColor}
                    onChange={handleColorChange}
                    className="w-50"
                />

                <p className="text-xs text-muted-foreground text-center">
                    This color will be used to personalize your profile.
                </p>
            </div>
        </SettingsWidget>
    );
}