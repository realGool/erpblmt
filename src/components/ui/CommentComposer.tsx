import type { MessageComposerProps } from "./MessageComposer";
import { MessageComposer } from "./MessageComposer";

export type CommentComposerProps = MessageComposerProps;

export function CommentComposer(props: CommentComposerProps) {
  return <MessageComposer {...props} />;
}
