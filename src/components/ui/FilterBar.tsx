import { useState, type ReactNode } from "react";
import { ListFilter } from "lucide-react";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export interface FilterBarProps {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function FilterBar({ left, right, className }: FilterBarProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">{left}</div>
        {right ? (
          <Button type="button" variant="outline" leftIcon={<ListFilter className="h-4 w-4" />} onClick={() => setOpen((current) => !current)}>
            {t("common.actions.filters")}
          </Button>
        ) : null}
      </div>
      {right && open ? (
        <div className="rounded-card border border-border bg-page p-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{right}</div>
        </div>
      ) : null}
    </div>
  );
}
