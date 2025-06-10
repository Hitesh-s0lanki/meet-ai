"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/constants";
import { useAgentFilter } from "../../hooks/use-agents-filter";
import { AgentSearchFilter } from "./agent-search-filter";
import { NewAgentDialog } from "./new-agent-dialog";

export function AgentsListHeader() {
  const [filters, setFilters] = useAgentFilter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModidified = !!filters.search;

  const onClearFilter = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenAction={setIsDialogOpen} />
      <div className="flex flex-col gap-y-4 p-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className="item-center flex gap-x-2 p-1">
          <AgentSearchFilter />
          {isAnyFilterModidified && (
            <Button variant="outline" onClick={onClearFilter}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
