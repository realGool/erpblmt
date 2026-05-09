import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-page py-6", className)} {...props} />;
}
