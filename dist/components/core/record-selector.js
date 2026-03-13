import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";
/* ------------------------------------------------------------
 * Generic record selector
 * ---------------------------------------------------------- */
export function RecordSelector({ data, value, setValue, label, identifier, placeholder = "Select…", className, loading = false, disabled = false, emptyMessage = "No results.", }) {
    const [open, setOpen] = React.useState(false);
    // Determine the display text for the button
    const getDisplayText = () => {
        if (loading)
            return "Loading...";
        if (value)
            return label(value);
        return placeholder;
    };
    // Determine if the component should be disabled
    const isDisabled = disabled || loading || data.length === 0;
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "default", role: "combobox", "aria-expanded": open, disabled: isDisabled, className: cn("w-full justify-between bg-input hover:bg-input cursor-pointer text-secondary ", className), "aria-label": "Select record", children: [getDisplayText(), _jsx(ChevronsUpDown, { className: "ml-2 size-4 opacity-50 shrink-0" })] }) }), _jsx(PopoverContent, { className: "w-(--radix-popover-trigger-width) p-0", children: _jsxs(Command, { children: [_jsx(CommandInput, { placeholder: "Search\u2026", className: "h-9" }), _jsxs(CommandList, { children: [_jsx(CommandEmpty, { children: emptyMessage }), _jsx(CommandGroup, { children: data.map((item) => {
                                        const text = label(item);
                                        const selected = value ? identifier(value) === identifier(item) : false;
                                        return (_jsx(CommandItem, { value: text, onSelect: () => {
                                                setValue(selected ? null : item);
                                                setOpen(false);
                                            }, children: text }, identifier(item)));
                                    }) })] })] }) })] }));
}
