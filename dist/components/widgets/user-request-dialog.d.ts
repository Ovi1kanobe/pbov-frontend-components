import * as React from "react";
interface UserRequestDialogProps<T extends {
    id: string;
    email: string;
}> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (selectedUsers: T[]) => void;
    users: T[];
    title?: string;
    description?: string;
}
export declare function UserRequestDialog<T extends {
    id: string;
    email: string;
}>({ open, onOpenChange, onConfirm, users, title, description, }: UserRequestDialogProps<T>): React.JSX.Element;
export {};
