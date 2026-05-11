import type { CrudSelectProps } from "./CrudSelect";
import { CrudSelect } from "./CrudSelect";

export type DictionarySelectProps = CrudSelectProps;

export function DictionarySelect(props: DictionarySelectProps) {
  return <CrudSelect {...props} />;
}
