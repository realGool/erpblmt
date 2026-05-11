import { FileAttachment } from "./FileAttachment";

export interface FileAttachmentItem {
  id: string;
  fileName: string;
}

export interface FileAttachmentListProps {
  files: FileAttachmentItem[];
  removeLabel?: string;
  onRemove?: (id: string) => void;
}

export function FileAttachmentList({ files, removeLabel, onRemove }: FileAttachmentListProps) {
  if (!files.length) return null;

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FileAttachment
          key={file.id}
          fileName={file.fileName}
          removeLabel={removeLabel}
          onRemove={onRemove ? () => onRemove(file.id) : undefined}
        />
      ))}
    </div>
  );
}
