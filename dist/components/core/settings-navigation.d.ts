import type { ReactNode } from "react";
export interface NavigationItem {
    id: string;
    label: string;
    icon: ReactNode;
    description: string;
    requiresManagerRole?: boolean;
    authorizedRoles?: string[];
}
interface SettingsNavigationProps {
    activeSection: string;
    onSectionChange: (sectionId: string) => void;
    navigationItems: NavigationItem[];
    userRole: string;
}
export declare function SettingsNavigation({ activeSection, onSectionChange, navigationItems, userRole }: SettingsNavigationProps): import("react/jsx-runtime").JSX.Element;
export {};
