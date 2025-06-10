import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

type Props = {
  open: boolean;
  onOpenAction: (open: boolean) => void;
};

export function NewAgentDialog({ open, onOpenAction }: Props) {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create new agent"
      open={open}
      onOpenAction={onOpenAction}>
      <AgentForm
        onSuccess={() => onOpenAction(false)}
        onCancel={() => onOpenAction(false)}
      />
    </ResponsiveDialog>
  );
}
