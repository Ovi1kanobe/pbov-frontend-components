import * as React from "react";
interface UserSelectionTableProps<T extends {
    id: string;
    email: string;
}> {
    users: T[];
    selectedUsers: T[];
    onSelectionChange: (selectedUsers: T[]) => void;
}
export declare function UserSelectionTable<T extends {
    id: string;
    email: string;
}>({ users, selectedUsers, onSelectionChange, }: UserSelectionTableProps<T>): React.JSX.Element;
export {};
