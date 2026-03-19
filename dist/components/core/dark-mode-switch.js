import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";
export function ToggleDarkModeSwitch({ isDarkMode, setDarkMode }) {
    function onToggleDarkMode(pressed) {
        try {
            setDarkMode(pressed);
        }
        catch {
            toast.error("Error updating dark mode preference");
        }
    }
    return (_jsxs("div", { className: "flex flex-row items-center justify-between space-x-2", children: [_jsx("p", { className: cn("text-sm text-muted-foreground transtion-all duration-500 font-semibold", isDarkMode ? "opacity-0" : "opacity-100"), children: "Light Mode" }), "      ", _jsxs(SwitchPrimitive.Root, { "data-slot": "switch", className: cn("relative cursor-pointer", "peer data-[state=checked]:bg-accent data-[state=unchecked]:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[2.15rem] w-16 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"), checked: isDarkMode, onCheckedChange: onToggleDarkMode, children: [isDarkMode ? (_jsx(Moon, { className: cn("absolute text-accent-foreground transition-all duration-1000 m-1", isDarkMode ? "opacity-100" : "opacity-0") })) : (_jsx(Sun, { className: cn("absolute transition-all duration-400 text-accent-foreground right-0 m-1", isDarkMode ? "opacity-0" : "opacity-100") })), _jsx(SwitchPrimitive.Thumb, { "data-slot": "switch-thumb", className: cn("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-8 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0") })] }), _jsx("p", { className: cn("text-sm text-muted-foreground transtion-all duration-500 font-semibold", isDarkMode ? "opacity-100" : "opacity-0"), children: "Dark Mode" })] }));
}
