import type { ReactNode } from "react";
import { Modal } from "./Modal";
import { Timeline, type TimelineItem } from "./Timeline";

export interface HistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  summary?: ReactNode;
  items: TimelineItem[];
}

export function HistoryDrawer({ open, onOpenChange, title, description, summary, items }: HistoryDrawerProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description} size="lg">
      <div className="space-y-5">
        {summary}
        <Timeline items={items} />
      </div>
    </Modal>
  );
}
