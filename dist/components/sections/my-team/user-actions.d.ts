import { type ReactNode } from "react";
export interface UserAction {
    label: string;
    icon?: ReactNode;
    onClick: () => void | Promise<void>;
    disabled?: boolean;
    hidden?: boolean;
    /** Render a separator immediately above this item. */
    separatorBefore?: boolean;
}
interface UserActionsProps {
    actions: UserAction[];
    /** Header shown at the top of the menu. */
    menuLabel?: ReactNode;
    disabled?: boolean;
}
export declare function UserActions({ actions, menuLabel, disabled }: UserActionsProps): import("react").JSX.Element | null;
export {};
