import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <section className={cn("space-y-4 border-b border-border pb-5 last:border-b-0 last:pb-0", className)}>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
