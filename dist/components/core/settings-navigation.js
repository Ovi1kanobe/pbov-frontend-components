import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@ovi1kanobe/pbov";
import { Card } from "@ovi1kanobe/pbov";
import { Settings, } from "lucide-react";
export function SettingsNavigation({ activeSection, onSectionChange, navigationItems, user }) {
    const filteredItems = navigationItems.filter(item => !item.authorizedRoles || (item.authorizedRoles && item.authorizedRoles.includes(user?.role)));
    return (_jsx(Card, { className: "p-4 h-fit sticky top-8", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Settings, { size: 16, className: "text-primary" }), _jsx("h3", { className: "font-semibold text-sm", children: "Settings" })] }), filteredItems.map((item) => (_jsx(Button, { variant: activeSection === item.id ? "default" : "ghost", className: `w-full justify-start h-auto p-3 ${activeSection === item.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/50"}`, onClick: () => onSectionChange(item.id), children: _jsxs("div", { className: "flex items-start gap-3 w-full", children: [_jsx("div", { className: `shrink-0 ${activeSection === item.id ? "text-primary-foreground" : "text-muted-foreground"}`, children: item.icon }), _jsxs("div", { className: "flex-1 text-left", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "text-sm font-medium", children: item.label }) }), _jsx("p", { className: `text-xs mt-1 ${activeSection === item.id
                                            ? "text-primary-foreground/80"
                                            : "text-muted-foreground"}`, children: item.description })] })] }) }, item.id)))] }) }));
}
