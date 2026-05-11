import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ModalFooterProps {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function ModalFooter({ left, right, className }: ModalFooterProps) {
  return (
    <div className={cn("flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="min-w-0">{left}</div>
      <div className="flex flex-wrap items-center justify-end gap-3">{right}</div>
    </div>
  );
}
