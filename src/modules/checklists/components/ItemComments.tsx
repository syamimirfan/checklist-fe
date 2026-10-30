import { useState, type SubmitEvent } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useCurrentUser,
} from "../../../app/hooks";
import {
  Avatar,
  Button,
  ClearableTextarea,
  Icon,
} from "../../../shared/components/ui";
import {
  surface,
  text,
  textareaFieldClasses,
} from "../../../shared/styles/theme";
import { createComment } from "../checklistsSlice";
import {
  clearCommentLabel,
  commentLabel,
  commentPlaceholder,
  commentsLabel,
  noCommentsText,
  postCommentLabel,
} from "../constants/checklistItem.const";
import type { ItemCommentsProps } from "../models/checklistItem.model";
import { selectCommentsByItemId, selectPeopleById } from "../selectors";
import { formatRelativeTime } from "../utils/date";

/**
 * The comment box under an item: the conversation and a field to add to it. It's apart from the
 * edit section (`ItemDetails`) on purpose: every role can comment, but only some can edit.
 * White with a border and chat bubbles, so it doesn't look like the gray edit panel.
 */
export function ItemComments({ item }: ItemCommentsProps) {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();
  const peopleById = useAppSelector(selectPeopleById);
  const commentsByItemId = useAppSelector(selectCommentsByItemId);
  const [commentBody, setCommentBody] = useState("");

  const comments = commentsByItemId.get(item.id) ?? [];

  async function handleComment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = commentBody.trim();
    if (!body) return;
    const result = await dispatch(
      createComment({ checklistItemId: item.id, userId: user.id, body }),
    );
    if (createComment.fulfilled.match(result)) setCommentBody("");
  }

  return (
    <section
      aria-label={commentsLabel}
      className={`mt-3 flex flex-col gap-3 rounded-xl border p-4 ${surface.border} ${surface.page}`}
    >
      <h3
        className={`flex items-center gap-2 text-sm font-medium ${text.label}`}
      >
        <Icon name="comment" className="h-4 w-4" />
        {commentsLabel}
        <span className={`font-normal ${text.muted}`}>{comments.length}</span>
      </h3>

      {comments.length === 0 ? (
        <p className={`text-sm ${text.muted}`}>{noCommentsText}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => {
            const authorName =
              peopleById.get(comment.userId)?.name ?? "Unknown user";
            return (
              <li key={comment.id} className="flex gap-2.5">
                <Avatar name={authorName} size="sm" className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className={`font-medium ${text.heading}`}>
                      {authorName}
                    </span>{" "}
                    <span className={`text-xs ${text.muted}`}>
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </p>
                  <p
                    className={`mt-1 inline-block max-w-full whitespace-pre-wrap wrap-break-word rounded-lg rounded-tl-sm px-3 py-2 text-sm ${surface.pageMuted} ${text.body}`}
                  >
                    {comment.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleComment} className="flex items-end gap-2">
        <ClearableTextarea
          rows={3}
          value={commentBody}
          onChange={(event) => setCommentBody(event.target.value)}
          onClear={() => setCommentBody("")}
          clearLabel={clearCommentLabel}
          onKeyDown={(event) => {
            // Enter starts a new line in a textarea, so Ctrl/Cmd+Enter is the keyboard way to post.
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder={commentPlaceholder}
          aria-label={commentLabel}
          className={textareaFieldClasses}
        />
        <Button
          type="submit"
          size="sm"
          className="shrink-0 whitespace-nowrap"
          disabled={!commentBody.trim()}
        >
          {postCommentLabel}
        </Button>
      </form>
    </section>
  );
}
