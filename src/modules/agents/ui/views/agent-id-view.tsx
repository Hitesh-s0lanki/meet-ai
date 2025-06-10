"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { toast } from "sonner";

import { GenerateAvatar } from "@/components/generate-avatar";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

type Props = {
  agentId: string;
};

export function AgentIdView({ agentId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [updateAgentUpdate, setUpdateAgentUpdate] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meeting`
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
        router.push("/agents");
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateAgentDialog
        open={updateAgentUpdate}
        onOpenAction={setUpdateAgentUpdate}
        agent={data}
      />
      <div className="flex flex-1 flex-col gap-y-4 overflow-hidden p-4 md:px-8">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentUpdate(true)}
          onRemove={handleRemoveAgent}
        />
        <div className="rounded-lg border bg-white">
          <div className="col-span-5 flex flex-col gap-y-5 p-4">
            <div className="flex items-center gap-x-3">
              <GenerateAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-10"
              />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4">
              <VideoIcon className="text-blue-700" />
              {data.meetingCount}{" "}
              {data.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
