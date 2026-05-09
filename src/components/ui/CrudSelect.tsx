import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "../../lib/cn";
import type { SelectOption } from "./Select";
import { Button } from "./Button";
import { Input } from "./Input";

export interface CrudSelectProps {
  label?: string;
  helperText?: string;
  error?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  addLabel: string;
  newItemLabel: string;
  newItemPlaceholder: string;
  saveLabel: string;
  cancelLabel: string;
  className?: string;
}

export function CrudSelect({
  label,
  helperText,
  error,
  value,
  options,
  onValueChange,
  addLabel,
  newItemLabel,
  newItemPlaceholder,
  saveLabel,
  cancelLabel,
  className,
}: CrudSelectProps) {
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [localOptions, setLocalOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const allOptions = useMemo(() => {
    const merged = [...options, ...localOptions];
    if (value && !merged.some((option) => option.value === value)) {
      merged.push({ value, label: displayDictionaryValue(value) });
    }
    return merged;
  }, [localOptions, options, value]);

  const selectedLabel = allOptions.find((option) => option.value === value)?.label ?? displayDictionaryValue(value);

  const saveNewOption = () => {
    const trimmedLabel = newLabel.trim();
    if (!trimmedLabel) return;

    const existing = allOptions.find((option) => option.label.toLocaleLowerCase() === trimmedLabel.toLocaleLowerCase());
    const nextOption = existing ?? { value: `custom:${trimmedLabel}`, label: trimmedLabel };

    if (!existing) setLocalOptions((current) => [...current, nextOption]);
    onValueChange(nextOption.value);
    setNewLabel("");
    setIsAdding(false);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative block space-y-1.5", className)}>
      {label ? (
        <span id={labelId} className="block text-sm font-medium text-text-secondary">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        aria-labelledby={label ? labelId : undefined}
        aria-expanded={open}
        className={cn(
          "focus-ring flex h-10 w-full items-center justify-between gap-3 rounded-input border bg-surface px-3 text-left text-sm text-text-primary shadow-card transition-colors",
          error ? "border-danger-text" : "border-border",
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-input border border-border bg-surface shadow-dropdown">
          <div className="max-h-56 overflow-auto py-1">
            {allOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-primary-soft",
                  option.value === value ? "font-medium text-primary" : "text-text-primary",
                )}
                onClick={() => {
                  onValueChange(option.value);
                  setOpen(false);
                }}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            ))}
          </div>

          <div className="border-t border-border p-2">
            {isAdding ? (
              <div className="space-y-2">
                <Input
                  label={newItemLabel}
                  value={newLabel}
                  placeholder={newItemPlaceholder}
                  onChange={(event) => setNewLabel(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveNewOption();
                    if (event.key === "Escape") setIsAdding(false);
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAdding(false);
                      setNewLabel("");
                    }}
                  >
                    {cancelLabel}
                  </Button>
                  <Button type="button" size="sm" onClick={saveNewOption}>
                    {saveLabel}
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="button" variant="ghost" size="sm" className="w-full justify-start" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsAdding(true)}>
                {addLabel}
              </Button>
            )}
          </div>
        </div>
      ) : null}

      {error ? (
        <span className="text-xs text-danger-text">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-text-muted">{helperText}</span>
      ) : null}
    </div>
  );
}

export function displayDictionaryValue(value: string) {
  return value.startsWith("custom:") ? value.replace("custom:", "") : value;
}
