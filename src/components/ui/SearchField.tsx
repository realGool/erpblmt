import { Search } from "lucide-react";
import type { InputProps } from "./Input";
import { Input } from "./Input";

export type SearchFieldProps = Omit<InputProps, "type" | "leftIcon">;

export function SearchField(props: SearchFieldProps) {
  return <Input type="search" leftIcon={<Search className="h-4 w-4" />} {...props} />;
}
