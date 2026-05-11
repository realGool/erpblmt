import type { SelectProps } from "./Select";
import { Select } from "./Select";

export type SortDropdownProps = SelectProps;

export function SortDropdown(props: SortDropdownProps) {
  return <Select {...props} />;
}
