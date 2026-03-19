import type { ReactNode } from "react";
interface SettingsSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}
export declare function Widget1({ title, description, children, icon, className }: SettingsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
