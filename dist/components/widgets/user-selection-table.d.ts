import * as React from "react";
export interface UserWithRole<T extends {
    id: string;
    email: string;
}> {
    user: T;
    role: string;
}
interface UserSelectionTableProps<T extends {
    id: string;
    email: string;
}> {
    users: T[];
    selectedUsersWithRoles: UserWithRole<T>[];
    onSelectionChange: (selectedUsersWithRoles: UserWithRole<T>[]) => void;
    availableRoles?: Record<string, string>;
    defaultRole?: string;
}
export declare function UserSelectionTable<T extends {
    id: string;
    email: string;
}>({ users, selectedUsersWithRoles, onSelectionChange, availableRoles, defaultRole, }: UserSelectionTableProps<T>): React.JSX.Element;
export {};
