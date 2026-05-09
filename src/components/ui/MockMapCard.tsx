import { MapPin, Navigation } from "lucide-react";
import { cn } from "../../lib/cn";
import { Card, CardContent } from "./Card";

export interface MockMapCardProps {
  title: string;
  placeholder: string;
  locationLabel: string;
  cityDistrict: string;
  street: string;
  coordinates: string;
  labels: string[];
  className?: string;
}

export function MockMapCard({ title, placeholder, locationLabel, cityDistrict, street, coordinates, labels, className }: MockMapCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative h-52 border-b border-border bg-primary-soft">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(37,99,235,0.10)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-0 opacity-80">
          <div className="absolute -left-10 top-16 h-3 w-[120%] -rotate-6 rounded-full bg-surface/90 shadow-card" />
          <div className="absolute left-8 top-10 h-2 w-[85%] rotate-12 rounded-full bg-surface/90 shadow-card" />
          <div className="absolute left-20 top-32 h-2 w-[72%] rotate-3 rounded-full bg-surface/90 shadow-card" />
          <div className="absolute left-1/4 top-0 h-[110%] w-2 rotate-12 rounded-full bg-surface/90 shadow-card" />
          <div className="absolute right-24 top-0 h-[110%] w-2 -rotate-12 rounded-full bg-surface/90 shadow-card" />
        </div>

        <div className="absolute left-4 top-4 rounded-input border border-border bg-surface/95 px-3 py-2 shadow-card">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Navigation className="h-4 w-4 text-primary" />
            {locationLabel}
          </div>
          <div className="mt-1 text-xs text-text-muted">{cityDistrict}</div>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
          {labels.map((label) => (
            <span key={label} className="rounded-full border border-border bg-surface/90 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-card">
              {label}
            </span>
          ))}
        </div>

        <div className="absolute left-1/2 top-[52%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-text-inverse shadow-dropdown ring-8 ring-primary/15">
          <MapPin className="h-6 w-6" />
        </div>
      </div>
      <CardContent className="space-y-2">
        <div className="text-sm font-semibold text-text-primary">{title}</div>
        <div className="text-sm text-text-muted">{placeholder}</div>
        <div className="flex items-start gap-2 rounded-input border border-border px-3 py-2 text-sm font-medium text-text-primary">
          <MapPin className="h-4 w-4 text-text-muted" />
          <span>
            {street}
            <span className="block text-xs font-normal text-text-muted">{coordinates}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
