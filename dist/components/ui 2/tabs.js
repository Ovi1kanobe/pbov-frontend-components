import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";
function Tabs({ className, orientation = "horizontal", ...props }) {
    return (_jsx(TabsPrimitive.Root, { "data-slot": "tabs", "data-orientation": orientation, className: cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className), ...props }));
}
const tabsListVariants = cva("group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none", {
    variants: {
        variant: {
            shadcn: "bg-muted text-muted-foreground",
            default: "bg-none text-secondary gap-4",
            line: "gap-1 bg-transparent text-muted-foreground",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function TabsList({ className, variant = "default", children, ...props }) {
    return (_jsxs("div", { className: "flex flex-col w-full", children: [_jsx(TabsPrimitive.List, { "data-slot": "tabs-list", "data-variant": variant, className: cn(tabsListVariants({ variant }), className), ...props, children: children }), _jsx(Separator, {})] }));
}
function Separator() {
    return _jsx("div", { className: "w-full h-px bg-border/60 -translate-y-1" });
}
function TabsTrigger({ className, ...props }) {
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx(TabsPrimitive.Trigger, { "data-slot": "tabs-trigger", className: cn("peer data-[state=active]:text-accent", className), ...props }), _jsx("div", { className: "\n          h-px w-full mt-1 bg-accent\n          opacity-0 peer-data-[state=active]:opacity-100\n          transition-opacity duration-200\n        " })] }));
}
function TabsContent({ className, ...props }) {
    return (_jsx(TabsPrimitive.Content, { "data-slot": "tabs-content", className: cn("flex-1 outline-none", className), ...props }));
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
