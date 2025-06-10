import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentGetOne } from "../../types";
import { AgentForm } from "./agent-form";

type Props = {
  open: boolean;
  agent: AgentGetOne;
  onOpenAction: (open: boolean) => void;
};

export function UpdateAgentDialog({ open, agent, onOpenAction }: Props) {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit the agent detail"
      open={open}
      onOpenAction={onOpenAction}>
      <AgentForm
        onSuccess={() => onOpenAction(false)}
        onCancel={() => onOpenAction(false)}
        initialValues={agent}
      />
    </ResponsiveDialog>
  );
}
