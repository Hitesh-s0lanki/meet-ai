"use client";

import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/empty-state";
import { useTRPC } from "@/trpc/client";
import { useAgentFilter } from "../../hooks/use-agents-filter";
import { columns } from "../components/columns";
import { DataPagination } from "../components/data-pagination";
import { DataTable } from "../components/data-table";

export function AgentsView() {
  const router = useRouter();
  const trpc = useTRPC();
  const [filters, setFilters] = useAgentFilter();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions(filters));

  return (
    <div className="flex flex-1 flex-col gap-y-4 overflow-hidden px-4 md:px-8">
      <DataTable
        data={data.items}
        columns={columns}
        onClickRow={(row) => router.push(`/agents/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create a agent to join your meeting. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
}
