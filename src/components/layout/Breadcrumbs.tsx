import { ChevronRight } from "lucide-react";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { t } = useI18n();

  return (
    <nav className={cn("flex items-center gap-2 text-sm text-text-muted", className)} aria-label={t("common.labels.breadcrumbs")}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <a className="transition-colors hover:text-primary" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span className={isLast ? "font-medium text-text-primary" : undefined}>{item.label}</span>
            )}
            {!isLast ? <ChevronRight className="h-4 w-4" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
