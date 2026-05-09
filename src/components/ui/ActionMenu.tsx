import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}

export interface ActionMenuProps {
  label: string;
  items: ActionMenuItem[];
}

export function ActionMenu({ label, items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="absolute right-0 top-11 z-30 min-w-40 rounded-card border border-border bg-surface p-1 shadow-dropdown">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "block w-full rounded-input px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-page",
                item.tone === "danger" ? "text-danger-text" : "text-text-primary",
              )}
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
