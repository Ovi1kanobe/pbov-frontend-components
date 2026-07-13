import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useRef, useState, } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "../components/ui/alert-dialog";
import { cn } from "../lib/utils";
const AlertDialogContext = createContext(undefined);
export function AlertDialogProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(null);
    const resolveRef = useRef(null);
    const confirm = useCallback((opts) => {
        setOptions(opts);
        setOpen(true);
        return new Promise((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);
    const handleConfirm = useCallback(() => {
        setOpen(false);
        resolveRef.current?.(true);
        resolveRef.current = null;
    }, []);
    const handleCancel = useCallback(() => {
        setOpen(false);
        resolveRef.current?.(false);
        resolveRef.current = null;
    }, []);
    const handleOpenChange = useCallback((newOpen) => {
        if (!newOpen)
            handleCancel();
    }, [handleCancel]);
    const value = useMemo(() => ({ confirm }), [confirm]);
    return (_jsxs(AlertDialogContext.Provider, { value: value, children: [children, _jsx(AlertDialog, { open: open, onOpenChange: handleOpenChange, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: options?.title }), _jsx(AlertDialogDescription, { children: options?.description })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { onClick: handleCancel, variant: "default", size: "sm", children: options?.cancelText || "Cancel" }), _jsx(AlertDialogAction, { variant: options?.variant || "default", size: "sm", onClick: handleConfirm, className: cn(options?.variant === "destructive" &&
                                        "bg-destructive text-destructive-foreground hover:bg-destructive/90"), children: options?.confirmText || "Confirm" })] })] }) })] }));
}
export function useAlertDialog() {
    const ctx = useContext(AlertDialogContext);
    if (!ctx) {
        throw new Error("useAlertDialog must be used within an AlertDialogProvider");
    }
    return ctx;
}
