import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const { t } = useI18n();
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav className={cn("flex items-center gap-2", className)} aria-label={t("common.labels.pagination")}>
      <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)} aria-label={t("common.actions.previous")}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((item) => (
        <Button
          key={item}
          variant={item === page ? "primary" : "outline"}
          size="icon"
          onClick={() => onPageChange?.(item)}
        >
          {item}
        </Button>
      ))}
      <Button variant="outline" size="icon" disabled={page >= pageCount} onClick={() => onPageChange?.(page + 1)} aria-label={t("common.actions.next")}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
