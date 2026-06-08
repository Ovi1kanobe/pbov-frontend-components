interface FeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
        subject?: string;
        description?: string;
        images?: File[];
    }) => Promise<void>;
}
export declare function FeedbackDialog({ open, onOpenChange, onSubmit }: FeedbackDialogProps): import("react").JSX.Element;
export {};
