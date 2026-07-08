import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../../ui/dropdown-menu";
export function UserActions({ actions, menuLabel = "Actions", disabled = false }) {
    const [isRunning, setIsRunning] = useState(false);
    const visible = actions.filter((action) => !action.hidden);
    if (!visible.length)
        return null;
    // async handlers disable the whole menu while in flight; sync ones just fire
    const run = async (action) => {
        const result = action.onClick();
        if (result instanceof Promise) {
            setIsRunning(true);
            try {
                await result;
            }
            finally {
                setIsRunning(false);
            }
        }
    };
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", disabled: disabled || isRunning, "aria-label": "Open user actions menu", children: [_jsx("span", { className: "sr-only", children: "Open menu" }), _jsx(MoreHorizontal, { className: "h-4 w-4" })] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuLabel, { children: menuLabel }), _jsx(DropdownMenuSeparator, {}), visible.map((action, i) => (_jsxs(Fragment, { children: [action.separatorBefore && _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onClick: () => run(action), disabled: disabled || isRunning || action.disabled, children: [action.icon && _jsx("span", { className: "mr-2 inline-flex", children: action.icon }), action.label] })] }, i)))] })] }));
}
