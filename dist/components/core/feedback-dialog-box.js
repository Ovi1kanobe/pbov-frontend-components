import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Button } from "@ovi1kanobe/pbov";
import { Input } from "@ovi1kanobe/pbov";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@ovi1kanobe/pbov";
import { Label } from "@ovi1kanobe/pbov";
import { toast } from "sonner";
import { Upload, X, FileImage, File } from "lucide-react";
export function FeedbackDialog({ open, onOpenChange, onSubmit }) {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    async function handleSubmitFeedback() {
        if (!subject.trim() && !description.trim()) {
            toast.error("Please provide either a subject or description");
            return;
        }
        setIsSubmitting(true);
        try {
            const submissionData = {
                subject: subject.trim() || undefined,
                description: description.trim() || undefined,
                images: selectedFiles.length > 0 ? selectedFiles : undefined,
            };
            await onSubmit(submissionData);
            // Clear the form and close dialog
            setSubject("");
            setDescription("");
            setSelectedFiles([]);
            onOpenChange(false);
            toast.success("Feedback submitted successfully! Thank you for your input.");
        }
        catch (error) {
            toast.error("Error submitting feedback. Please try again.");
            console.error("Error submitting feedback:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    }
    function handleCloseDialog() {
        onOpenChange(false);
        setSubject("");
        setDescription("");
        setSelectedFiles([]);
    }
    function handleFileSelect() {
        fileInputRef.current?.click();
    }
    function handleFileChange(e) {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setSelectedFiles(prev => [...prev, ...fileArray]);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }
    function removeFile(index) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }
    function isImageFile(file) {
        return file.type.startsWith('image/');
    }
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[600px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Send Feedback" }), _jsx(DialogDescription, { children: "Help us improve the application by sharing your feedback, suggestions, or reporting issues. You can also attach images or documents to provide more context." })] }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "feedback-subject", children: "Subject" }), _jsx(Input, { id: "feedback-subject", value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Brief summary of your feedback (optional)", disabled: isSubmitting })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "feedback-description", children: "Description" }), _jsx("textarea", { id: "feedback-description", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Describe your feedback, suggestion, or issue in detail...", disabled: isSubmitting, rows: 6, className: "min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Attachments (optional)" }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: handleFileSelect, disabled: isSubmitting, className: "w-full justify-start", "aria-label": "Add files", children: [_jsx(Upload, { className: "mr-2 h-4 w-4" }), "Add Files (images, documents, etc.)"] }), selectedFiles.length > 0 && (_jsx("div", { className: "space-y-2 max-h-32 overflow-y-auto", children: selectedFiles.map((file, index) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-muted rounded-md", children: [_jsxs("div", { className: "flex items-center space-x-2 min-w-0 flex-1", children: [isImageFile(file) ? (_jsx(FileImage, { className: "h-4 w-4 text-blue-500 shrink-0" })) : (_jsx(File, { className: "h-4 w-4 text-gray-500 shrink-0" })), _jsx("span", { className: "text-sm truncate", title: file.name, children: file.name }), _jsxs("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: ["(", (file.size / 1024).toFixed(1), " KB)"] })] }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => removeFile(index), disabled: isSubmitting, className: "h-6 w-6 p-0 shrink-0", "aria-label": "Remove file", children: _jsx(X, { className: "h-3 w-3" }) })] }, `${file.name}-${index}`))) })), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, multiple: true, accept: "image/*,.pdf,.doc,.docx,.txt", className: "hidden" })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: handleCloseDialog, disabled: isSubmitting, "aria-label": "Cancel", children: "Cancel" }), _jsx(Button, { onClick: handleSubmitFeedback, disabled: isSubmitting || (!subject.trim() && !description.trim()), "aria-label": "Submit feedback", children: isSubmitting ? "Submitting..." : "Submit Feedback" })] })] }) }));
}
