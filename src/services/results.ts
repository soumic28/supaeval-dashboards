import { apiClient } from "@/lib/api-client";
import type { EvalResult } from "@/types/models";

export const resultService = {
  getById: async (id: string) => {
    return apiClient.get<any, EvalResult>(`/results/${id}`);
  },

  getByJob: async (jobId: string) => {
    return apiClient.get<any, EvalResult[]>(`/jobs/${jobId}/results`);
  },

  getByAgent: async (agentId: string) => {
    return apiClient.get<any, EvalResult[]>(`/agents/${agentId}/results`);
  },

  // Aggregations
  getSummary: async () => {
    return apiClient.get<any, any>("/results/summary");
  },

  getTrends: async () => {
    return apiClient.get<any, any>("/results/trends");
  },
};
