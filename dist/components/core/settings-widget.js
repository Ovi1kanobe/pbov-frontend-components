import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ovi1kanobe/pbov";
export function SettingsWidget({ title, description, children, icon, className = "" }) {
    return (_jsxs(Card, { className: `transition-all duration-200 hover:shadow-md ${className}`, children: [_jsx(CardHeader, { className: "pb-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [icon && (_jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary", children: icon })), _jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-lg", children: title }), description && (_jsx(CardDescription, { className: "mt-1", children: description }))] })] }) }), _jsx(CardContent, { className: "pt-0", children: children })] }));
}
