import type { ReactNode } from "react";
interface SettingsSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}
export declare function SettingsWidget({ title, description, children, icon, className }: SettingsSectionProps): import("react").JSX.Element;
export {};
