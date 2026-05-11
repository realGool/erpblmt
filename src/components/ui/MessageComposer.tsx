import type { ReactNode } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { Textarea } from "./Textarea";

export interface MessageComposerProps {
  placeholder: string;
  sendLabel: string;
  attachmentLabel?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onAttach?: () => void;
  helperText?: ReactNode;
  className?: string;
}

export function MessageComposer({
  placeholder,
  sendLabel,
  attachmentLabel,
  value,
  onChange,
  onSend,
  onAttach,
  helperText,
  className,
}: MessageComposerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Textarea
        className="min-h-12 resize-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-text-muted">{helperText}</div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {attachmentLabel ? (
            <Button variant="outline" leftIcon={<Paperclip className="h-4 w-4" />} onClick={onAttach}>
              {attachmentLabel}
            </Button>
          ) : null}
          <Button leftIcon={<Send className="h-4 w-4" />} onClick={onSend}>
            {sendLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
