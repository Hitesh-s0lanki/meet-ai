import { Dispatch, SetStateAction, useState } from "react";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function DashboardCommand({ open, setOpen }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const trpc = useTRPC();
  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({
      search,
      pageSize: 100,
    })
  );
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      search,
      pageSize: 100,
    })
  );

  return (
    <CommandResponsiveDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}>
      <CommandInput
        placeholder="Find a meeting or agent..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span className=" text-muted-foreground text-sm">
              No meetings found
            </span>
          </CommandEmpty>
          {meetings.data?.items.map((meeting) => (
            <CommandItem
              key={meeting.id}
              onSelect={() => {
                router.push(`/meetings/${meeting.id}`);
                setOpen(false);
              }}>
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span className=" text-muted-foreground text-sm">
              No agents found
            </span>
          </CommandEmpty>
          {agents.data?.items.map((meeting) => (
            <CommandItem
              key={meeting.id}
              onSelect={() => {
                router.push(`/agents/${meeting.id}`);
                setOpen(false);
              }}>
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
}
