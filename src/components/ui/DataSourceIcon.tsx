import { CheckCircle2, Gamepad2, PencilLine, TriangleAlert } from "lucide-react";
import { cn } from "../../lib/cn";

export type DataSourceIconType = "teacher" | "bilimtoy" | "combined" | "needsReview" | "confirmed";

export interface DataSourceIconProps {
  type: DataSourceIconType;
  label: string;
  className?: string;
}

export function DataSourceIcon({ type, label, className }: DataSourceIconProps) {
  const icons = {
    teacher: <PencilLine className="h-3.5 w-3.5" />,
    bilimtoy: <Gamepad2 className="h-3.5 w-3.5" />,
    combined: (
      <>
        <PencilLine className="h-3.5 w-3.5" />
        <Gamepad2 className="h-3.5 w-3.5" />
      </>
    ),
    needsReview: <TriangleAlert className="h-3.5 w-3.5" />,
    confirmed: <CheckCircle2 className="h-3.5 w-3.5" />,
  };

  const styles = {
    teacher: "bg-info-bg text-info-text",
    bilimtoy: "bg-purple-bg text-purple-text",
    combined: "bg-primary-soft text-primary",
    needsReview: "bg-warning-bg text-warning-text",
    confirmed: "bg-success-bg text-success-text",
  };

  return (
    <span title={label} aria-label={label} className={cn("inline-flex items-center gap-1 rounded-[6px] px-1.5 py-1", styles[type], className)}>
      {icons[type]}
    </span>
  );
}
