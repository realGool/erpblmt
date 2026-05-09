import { FileText, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export interface FileAttachmentProps {
  fileName: string;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

export function FileAttachment({ fileName, onRemove, removeLabel, className }: FileAttachmentProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-3 rounded-input border border-border bg-surface px-3 text-sm shadow-card",
        className,
      )}
    >
      <FileText className="h-4 w-4 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 truncate font-medium text-primary">{fileName}</span>
      {onRemove ? (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove} aria-label={removeLabel}>
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
