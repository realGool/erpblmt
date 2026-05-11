import { Badge } from "./Badge";

export type NicuScore = "n" | "i" | "ch" | "u";

export interface NicuScoreBadgeProps {
  score: NicuScore;
  labels: Record<NicuScore, string>;
  compact?: boolean;
}

const scoreVariants: Record<NicuScore, "danger" | "warning" | "info" | "success"> = {
  n: "danger",
  i: "warning",
  ch: "info",
  u: "success",
};

export function NicuScoreBadge({ score, labels, compact }: NicuScoreBadgeProps) {
  return (
    <Badge variant={scoreVariants[score]} className={compact ? "min-h-6 px-2 py-0.5" : undefined}>
      {labels[score]}
    </Badge>
  );
}
