import { Card, CardContent } from "./Card";
import { StackedNicuBar, type NicuLabels, type NicuValue } from "./StackedNicuBar";

export interface NicuDistributionItem {
  area: string;
  value: NicuValue;
}

export interface NicuDistributionCardProps {
  title: string;
  description: string;
  items: NicuDistributionItem[];
  labels: NicuLabels;
  areaLabel: (area: string) => string;
}

const legendItems = [
  { key: "n", className: "bg-danger-bg text-danger-text" },
  { key: "i", className: "bg-warning-bg text-warning-text" },
  { key: "ch", className: "bg-success-bg text-success-text" },
  { key: "u", className: "bg-info-bg text-info-text" },
] as const;

export function NicuDistributionCard({ title, description, items, labels, areaLabel }: NicuDistributionCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-text-primary">{title}</div>
            <div className="mt-1 text-xs text-text-muted">{description}</div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {legendItems.map((item) => (
              <span key={item.key} className={`rounded-[6px] px-2 py-1 text-[11px] font-semibold leading-none ${item.className}`}>
                {labels[item.key]}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.area} className="grid gap-2 rounded-input border border-border px-3 py-2 lg:grid-cols-[190px_minmax(0,1fr)]">
              <div className="text-xs font-medium leading-5 text-text-secondary">{areaLabel(item.area)}</div>
              <StackedNicuBar value={item.value} labels={labels} compact className="min-w-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
