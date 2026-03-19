import { RecordSelector } from "@ovi1kanobe/pbov";
import { Widget1 } from "../core/widget-type-1";
import { Paintbrush } from "lucide-react";

type ThemeSelectionWidgetProps = {
    availableThemes: { label: string; value: string }[];
    theme: string;
    setTheme: (theme: string) => void;
}

export function ThemeSelectionWidget({ availableThemes, theme, setTheme }: ThemeSelectionWidgetProps) {

  return (
    <Widget1
        title="Application Theme"
        description="Choose your preffered color scheme"
        icon={<Paintbrush size={18} />}
    >
        <div className="flex flex-col gap-4">
    <RecordSelector
      data={availableThemes}
      value={availableThemes.find((t) => t.value === theme) || null}
      setValue={(selectedTheme) => {
        if (selectedTheme) {
          setTheme(selectedTheme.value);
        }
      }}
      label={(themeOption) => themeOption.label}
      identifier={(themeOption) => themeOption.value}
      placeholder="Select theme..."
      className="w-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      emptyMessage="No theme found."
    />
    <p className="text-xs text-muted-foreground"> Select from our collection of carefully crafted themes to personalize your experience.</p>
    </div>
    </Widget1>
  );
}