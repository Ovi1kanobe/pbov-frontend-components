export type RouteAction = "logout";

export interface RouteConfig {
  label: string;
  sidebarLabel?: string; // Optional different label for sidebar
  path?: string;
  action?: RouteAction; // Action to perform instead of navigation
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  showInHeader?: boolean;
  showInSidebar?: boolean;
  requiredRoles?: /*unresolved*/any[];
  description?: string; // For future use in tooltips, etc.
  isExternal?: boolean; // For external links
}