export type RouteAction = "logout";
export interface RouteConfig {
    label: string;
    sidebarLabel?: string;
    path?: string;
    action?: RouteAction;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    showInHeader?: boolean;
    showInSidebar?: boolean;
    requiredRoles?: any[];
    description?: string;
    isExternal?: boolean;
}
