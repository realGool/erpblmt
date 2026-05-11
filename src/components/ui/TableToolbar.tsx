import { useState, type ReactNode } from "react";
import { ListFilter } from "lucide-react";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export interface TableToolbarProps {
  title?: ReactNode;
  description?: ReactNode;
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TableToolbar({ title, description, search, filters, actions, className }: TableToolbarProps) {
  const { t } = useI18n();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {title || description ? (
          <div className="min-w-0">
            {title ? <div className="text-card-title text-text-primary">{title}</div> : null}
            {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
          {search ? <div className="min-w-60 flex-1 sm:max-w-md">{search}</div> : null}
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          {filters ? (
            <Button type="button" variant="outline" leftIcon={<ListFilter className="h-4 w-4" />} onClick={() => setFiltersOpen((current) => !current)}>
              {t("common.actions.filters")}
            </Button>
          ) : null}
        </div>
      </div>
      {filters && filtersOpen ? <div className="grid gap-3 rounded-card border border-border bg-page p-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filters}</div> : null}
    </div>
  );
}
