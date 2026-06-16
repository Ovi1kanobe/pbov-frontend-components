import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { cn } from "../lib/utils";

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

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
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

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) handleCancel();
    },
    [handleCancel],
  );

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <AlertDialogContext.Provider value={value}>
      {children}
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options?.title}</AlertDialogTitle>
            <AlertDialogDescription>{options?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} variant="default" size="sm">
              {options?.cancelText || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              variant={options?.variant || "default"}
              size="sm"
              onClick={handleConfirm}
              className={cn(
                options?.variant === "destructive" &&
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
            >
              {options?.confirmText || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}

export function useAlertDialog(): AlertDialogContextType {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) {
    throw new Error("useAlertDialog must be used within an AlertDialogProvider");
  }
  return ctx;
}
