import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Lightbulb, } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { Toggle } from "../ui/toggle";
import { toast } from "sonner";
import {} from "../../lib/routes";
export function Sidebar({ onLogout, routes, userName, isDarkMode, setDarkMode, logoSrc, applicationName, applicationShortDescription }) {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;
    // Use isDarkMode from context
    const lightMode = !isDarkMode;
    // Get filtered routes for sidebar based on user role
    function onToggleLightMode(pressed) {
        try {
            setDarkMode(!pressed);
        }
        catch {
            toast.error("Error updating dark mode preference");
        }
    }
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
    return (_jsxs(_Fragment, { children: [_jsxs("aside", { className: "\n        fixed top-0 left-0 h-full\n        flex flex-col\n        bg-sidebar\n        text-sidebar-foreground backdrop-blur-md\n        transition-all duration-500 backdrop-saturate-200 backdrop-brightness-110\n        saturate-125\n        w-(--sidebar-collapsed-width)\n        hover:w-(--sidebar-width)\n        z-50 group rounded-r-3xl pt-20 items-center\n      ", children: [_jsxs("div", { className: "flex flex-col items-center p-4 rounded-xl transition-all duration-300", children: [_jsx("img", { src: logoSrc, alt: "Logo", className: "w-8 h-8 group-hover:w-12 group-hover:h-12  shrink-0 transition-all duration-400" }), _jsxs("div", { className: "text-center flex flex-col gap-1 items-center", children: [_jsx("p", { className: "mt-2 text-xl opacity-0 font-special font-semibold group-hover:opacity-100 transition-opacity duration-300 text-nowrap", children: applicationName || "App Name" }), _jsx("p", { className: "mt-0 text-md opacity-0 italic text-sidebar-foreground group-hover:opacity-100 transition-opacity duration-300 text-nowrap", children: applicationShortDescription || "Admin Dashboard" }), _jsx("p", { className: "mt-2 text-sm opacity-0 text-sidebar-accent group-hover:opacity-100 transition-opacity duration-300 text-nowrap", children: userName || "Guest" })] })] }), _jsx("div", { className: "flex flex-row w-full justify-center items-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: _jsx(Toggle, { "aria-label": "Toggle light/dark mode", className: "data-[state=on]:bg-sidebar-accent", pressed: lightMode, onPressedChange: onToggleLightMode, children: _jsx(Lightbulb, {}) }) }), _jsx(Separator, { className: "group-hover:opacity-100 opacity-0 transition-opacity duration-500 mb-10" }), _jsx("nav", { className: "flex flex-col w-full items-left justify-start relative", children: routes.map((route) => {
                            const { Icon, label, sidebarLabel, path: linkPath, action } = route;
                            const isActive = linkPath && path === linkPath;
                            if (action) {
                                return (_jsx("button", { onClick: () => handleRouteClick(route), className: "flex flex-row hover:text-sidebar-accent/60 justify-start ml-4 group-hover:translate-x-12 p-2 rounded-xl items-center transition-all duration-400 cursor-pointer", "aria-label": sidebarLabel || label, children: _jsxs("div", { className: "flex flex-row", children: [Icon && _jsx(Icon, { className: "w-6 h-6" }), _jsx("span", { className: "opacity-0 text-nowrap group-hover:block transition-opacity duration-500 ml-4 group-hover:opacity-100", children: sidebarLabel || label })] }) }, label));
                            }
                            return (_jsx(NavLink, { to: linkPath, className: "flex flex-row hover:text-sidebar-accent/60 justify-start ml-4 group-hover:translate-x-12 p-2 rounded-xl items-center transition-all duration-400", "aria-label": `Navigate to ${sidebarLabel || label}`, children: _jsxs("div", { className: "flex flex-row", children: [Icon && (_jsx(Icon, { className: `w-6 h-6 ${isActive ? "text-sidebar-accent" : ""}` })), _jsx("span", { className: `
                    opacity-0 text-nowrap group-hover:block
                    transition-opacity duration-500 ml-4 group-hover:opacity-100
                    ${isActive ? "text-sidebar-accent" : ""}
                  `, children: sidebarLabel || label })] }) }, label));
                        }) })] }), _jsx("div", { className: "fixed top-0 left-0 h-full\n        bg-none hidden\n        text-sidebar-foreground\n        transition-all duration-500\n        w-(--sidebar-collapsed-width)\n        hover:w-(--sidebar-width)\n        z-50 group rounded-r-3xl pt-20 group items-center" })] }));
}
