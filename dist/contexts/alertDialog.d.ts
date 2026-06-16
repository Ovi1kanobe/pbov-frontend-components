import type { ReactNode } from "react";
export interface ConfirmOptions {
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    variant?: "default" | "destructive";
}
export interface AlertDialogContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}
export declare function AlertDialogProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useAlertDialog(): AlertDialogContextType;
