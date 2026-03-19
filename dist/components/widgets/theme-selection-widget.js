import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RecordSelector } from "@ovi1kanobe/pbov";
import { Widget1 } from "../core/widget-type-1";
import { Paintbrush } from "lucide-react";
export function ThemeSelectionWidget({ availableThemes, theme, setTheme }) {
    return (_jsx(Widget1, { title: "Application Theme", description: "Choose your preffered color scheme", icon: _jsx(Paintbrush, { size: 18 }), children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(RecordSelector, { data: availableThemes, value: availableThemes.find((t) => t.value === theme) || null, setValue: (selectedTheme) => {
                        if (selectedTheme) {
                            setTheme(selectedTheme.value);
                        }
                    }, label: (themeOption) => themeOption.label, identifier: (themeOption) => themeOption.value, placeholder: "Select theme...", className: "w-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground", emptyMessage: "No theme found." }), _jsx("p", { className: "text-xs text-muted-foreground", children: " Select from our collection of carefully crafted themes to personalize your experience." })] }) }));
}
