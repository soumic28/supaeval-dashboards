import { apiClient } from "@/lib/api-client";
import type { Trace } from "@/types/models";

export const traceService = {
  // Ingestion is typically server-side/SDK, but frontend might upload manually
  ingest: async (traces: Trace[]) => {
    return apiClient.post("/traces/batch", { traces });
  },

  getById: async (id: string) => {
    return apiClient.get<any, Trace>(`/traces/${id}`);
  },

  getByAgent: async (agentId: string) => {
    return apiClient.get<any, Trace[]>(`/agents/${agentId}/traces`);
  },
};
