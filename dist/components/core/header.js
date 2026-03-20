import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import { Button } from "../ui/button";
import { FeedbackDialog } from "./feedback-dialog-box";
export function AppHeader({ title, onLogout, routes, version, onSubmitFeedback }) {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    function handleRouteClick(route) {
        if (route.action) {
            switch (route.action) {
                case "logout":
                    onLogout();
                    break;
            }
        }
        else if (route.path) {
            navigate(route.path);
        }
    }
    return (_jsxs("div", { className: "flex flex-row w-full justify-between", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("h1", { className: "text-2xl font-semibold mb-2", children: title }), _jsx("div", { className: "hidden md:flex flex-row gap-2 h-6 items-center text-sm text-secondary", children: routes.map((link, idx) => (_jsx(Fragment, { children: link.action ? (_jsxs("button", { onClick: () => handleRouteClick(link), className: "flex items-center gap-2 hover:text-gray-700 h-full transition-colors cursor-pointer", children: [_jsx("p", { children: link.label }), idx !== routes.length - 1 && (_jsx("div", { className: "w-0.5 h-3/4 bg-gray-300" }))] })) : (_jsxs(NavLink, { to: link.path, className: "flex items-center gap-2 hover:text-gray-700 h-full transition-colors", children: [_jsx("p", { className: path === link.path ? "font-semibold text-accent" : "", children: link.label }), idx !== routes.length - 1 && (_jsx("div", { className: "w-0.5 h-3/4 bg-gray-300" }))] })) }, link.path || link.label))) })] }), _jsxs("div", { className: "flex flex-row gap-2 items-center", children: [_jsxs(Link, { to: "/patch-notes", className: "hidden hover:underline lg:block text-sm text-muted-foreground mr-2 hover:text-gray-700 transition-colors", children: ["Version: ", version] }), _jsx(Link, { to: "/docs", className: "flex items-center flex-row", children: _jsxs(Button, { variant: "link", className: "cursor-pointer", "aria-label": "Help", children: [_jsx(HelpCircle, {}), _jsx("p", { className: "text-sm text-secondary", children: "Help" })] }) }), _jsxs(Button, { variant: "link", className: "cursor-pointer", onClick: () => setFeedbackDialogOpen(true), "aria-label": "Feedback", children: [_jsx(MessageCircle, {}), _jsx("p", { className: "text-sm text-secondary", children: "Feedback" })] })] }), _jsx(FeedbackDialog, { open: feedbackDialogOpen, onOpenChange: setFeedbackDialogOpen, onSubmit: onSubmitFeedback })] }));
}
