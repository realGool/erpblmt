import type { ActionMenuItem } from "./ActionMenu";
import { ActionMenu } from "./ActionMenu";

export interface RowActionMenuProps {
  label: string;
  items: ActionMenuItem[];
}

export function RowActionMenu(props: RowActionMenuProps) {
  return <ActionMenu {...props} />;
}
