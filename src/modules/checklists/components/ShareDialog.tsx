import { useState, type SubmitEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Alert, Button, Icon, Input, Modal } from "../../../shared/components/ui";
import { text } from "../../../shared/styles/theme";
import { inviteMember } from "../checklistsSlice";
import { defaultErrorMessage } from "../constants/checklists.const";
import {
  alreadyMemberMessage,
  copyLinkLabel,
  inviteEmailLabel,
  inviteEmailPlaceholder,
  inviteEmailRequired,
  inviteLabel,
  invitedMessage,
  linkCopiedMessage,
  linkCopyFailedMessage,
  shareDescription,
  shareTitle,
} from "../constants/checklistDialogs.const";
import type { ShareDialogProps } from "../models/checklistDialogs.model";
import {
  selectMembersByWorkspaceId,
  selectPeopleById,
  selectWorkspacesById,
} from "../selectors";
import { messageOf } from "../utils/checklistUtils";

/**
 * Sharing is workspace-level: the ERD has no per-checklist access, only
 * WORKSPACE_MEMBERS. So "Share" invites someone to the checklist's workspace.
 */
export function ShareDialog({ open, onClose, workspaceId }: ShareDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={shareTitle}>
      <ShareForm workspaceId={workspaceId} />
    </Modal>
  );
}

/** Split from the dialog so its state starts fresh each time the (child-unmounting) Modal reopens. */
function ShareForm({ workspaceId }: Pick<ShareDialogProps, "workspaceId">) {
  const dispatch = useAppDispatch();
  const workspacesById = useAppSelector(selectWorkspacesById);
  const membersByWorkspaceId = useAppSelector(selectMembersByWorkspaceId);
  const peopleById = useAppSelector(selectPeopleById);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workspaceName = workspacesById.get(workspaceId)?.name ?? "this workspace";

  async function handleInvite(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    setSuccess(null);
    if (!trimmed) {
      setError(inviteEmailRequired);
      return;
    }
    const alreadyMember = (membersByWorkspaceId.get(workspaceId) ?? []).some(
      (member) =>
        peopleById.get(member.userId)?.email.toLowerCase() ===
        trimmed.toLowerCase(),
    );
    if (alreadyMember) {
      setError(alreadyMemberMessage);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const { person } = await dispatch(
        inviteMember({ workspaceId, email: trimmed }),
      ).unwrap();
      setSuccess(invitedMessage(person.name, workspaceName));
      setEmail("");
    } catch (caught) {
      setError(messageOf(caught, defaultErrorMessage));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkMessage(linkCopiedMessage);
    } catch {
      // Clipboard access is blocked on insecure origins and in some embedded browsers.
      setLinkMessage(linkCopyFailedMessage);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className={`text-sm ${text.body}`}>{shareDescription(workspaceName)}</p>

      <form onSubmit={handleInvite} className="flex flex-col gap-4" noValidate>
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Input
          label={inviteEmailLabel}
          type="email"
          autoComplete="off"
          placeholder={inviteEmailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
        />
        <Button type="submit" isLoading={isSubmitting}>
          {inviteLabel}
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        <Button type="button" variant="outline" onClick={handleCopyLink}>
          <Icon name="share" />
          {copyLinkLabel}
        </Button>
        {linkMessage && (
          <p className={`text-sm ${text.muted}`} role="status">
            {linkMessage}
          </p>
        )}
      </div>
    </div>
  );
}
