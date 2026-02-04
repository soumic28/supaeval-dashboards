import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentService } from "@/services/agents";
import { datasetService } from "@/services/datasets";

// --- Agents ---
export function useAgents() {
  const queryClient = useQueryClient();

  const agentsQuery = useQuery({
    queryKey: ["agents"],
    queryFn: agentService.getAll,
  });

  const createAgentMutation = useMutation({
    mutationFn: agentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });

  return {
    agents: agentsQuery.data,
    isLoading: agentsQuery.isLoading,
    createAgent: createAgentMutation.mutate,
  };
}

export function useAgentConfig(agentId: string) {
  return useQuery({
    queryKey: ["agent-config", agentId],
    queryFn: () => agentService.getConfig(agentId),
    enabled: !!agentId,
  });
}

// --- Datasets ---
export function useDatasets() {
  return useQuery({
    queryKey: ["datasets"],
    queryFn: datasetService.getAll,
  });
}

export function useDatasetEntries(datasetId: string) {
  return useQuery({
    queryKey: ["dataset-entries", datasetId],
    queryFn: () => datasetService.getEntries(datasetId),
    enabled: !!datasetId,
  });
}
