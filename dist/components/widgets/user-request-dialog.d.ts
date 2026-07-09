import * as React from "react";
import { type UserWithRole } from "./user-selection-table";
interface UserRequestDialogProps<T extends {
    id: string;
    email: string;
}> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (selectedUsersWithRoles: UserWithRole<T>[]) => void;
    users: T[];
    availableRoles?: Record<string, string>;
    defaultRole?: string;
    title?: string;
    description?: string;
    className?: string;
}
export declare function UserRequestDialog<T extends {
    id: string;
    email: string;
}>({ open, onOpenChange, onConfirm, users, availableRoles, defaultRole, title, description, className, }: UserRequestDialogProps<T>): React.JSX.Element;
export {};
