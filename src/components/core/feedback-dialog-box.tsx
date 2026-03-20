import { useState, useRef } from "react";
import { Button } from "@ovi1kanobe/pbov";
import { Input } from "@ovi1kanobe/pbov";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ovi1kanobe/pbov";
import { Label } from "@ovi1kanobe/pbov";
import { toast } from "sonner";
import { Upload, X, FileImage, File } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    subject?: string;
    description?: string;
    images?: File[];
  }) => Promise<void>;
}

export function FeedbackDialog({ open, onOpenChange, onSubmit }: FeedbackDialogProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    } catch (error) {
      toast.error("Error submitting feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    } finally {
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  function removeFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  function isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve the application by sharing your feedback, suggestions, or reporting issues. 
            You can also attach images or documents to provide more context.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="feedback-subject">
              Subject
            </Label>
            <Input
              id="feedback-subject"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              placeholder="Brief summary of your feedback (optional)"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feedback-description">
              Description
            </Label>
            <textarea
              id="feedback-description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe your feedback, suggestion, or issue in detail..."
              disabled={isSubmitting}
              rows={6}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label>
              Attachments (optional)
            </Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleFileSelect}
                disabled={isSubmitting}
                className="w-full justify-start"
                aria-label="Add files"
              >
                <Upload className="mr-2 h-4 w-4" />
                Add Files (images, documents, etc.)
              </Button>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        {isImageFile(file) ? (
                          <FileImage className="h-4 w-4 text-blue-500 shrink-0" />
                        ) : (
                          <File className="h-4 w-4 text-gray-500 shrink-0" />
                        )}
                        <span className="text-sm truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        disabled={isSubmitting}
                        className="h-6 w-6 p-0 shrink-0"
                        aria-label="Remove file"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                className="hidden"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting} aria-label="Cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || (!subject.trim() && !description.trim())}
            aria-label="Submit feedback"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}