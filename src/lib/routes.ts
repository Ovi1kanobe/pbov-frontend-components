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

export function getFilteredRoutes(
  userRole: string | undefined,
  routes: RouteConfig[],
  showInHeader?: boolean,
  showInSidebar?: boolean
): RouteConfig[] {
  return routes.filter((route) => {
    // Filter by role if required (each role only sees their specific routes)
    if (route.requiredRoles && (!userRole || !route.requiredRoles.includes(userRole))) {
      return false;
    }

    // Filter by visibility in header/sidebar
    if (showInHeader !== undefined && route.showInHeader !== showInHeader) {
      return false;
    }
    
    if (showInSidebar !== undefined && route.showInSidebar !== showInSidebar) {
      return false;
    }

    return true;
  });
}

// Utility function to find a route by path
export function getRouteByPath(path: string, routes: RouteConfig[]): RouteConfig | undefined {
  return routes.find(route => route.path === path);
}