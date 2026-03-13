import { type RouteConfig } from "../../lib/routes";
type SidebarProps = {
    onLogout: () => void;
    routes: RouteConfig[];
    userName?: string;
    isDarkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    logoSrc?: string;
    applicationName?: React.ReactNode;
    applicationShortDescription?: string;
};
export declare function Sidebar({ onLogout, routes, userName, isDarkMode, setDarkMode, logoSrc, applicationName, applicationShortDescription }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
