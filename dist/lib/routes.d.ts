export type RouteAction = "logout";
export interface RouteConfig {
    label: string;
    sidebarLabel?: string;
    path?: string;
    action?: RouteAction;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    showInHeader?: boolean;
    showInSidebar?: boolean;
    requiredRoles?: string[];
    description?: string;
    isExternal?: boolean;
}
export declare function getFilteredRoutes(userRole: string | undefined, routes: RouteConfig[], showInHeader?: boolean, showInSidebar?: boolean): RouteConfig[];
export declare function getRouteByPath(path: string, routes: RouteConfig[]): RouteConfig | undefined;
