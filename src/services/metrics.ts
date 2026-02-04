import { apiClient } from "@/lib/api-client";
import type { Metric } from "@/types/models";

export const metricService = {
  create: async (data: Partial<Metric>) => {
    return apiClient.post<any, Metric>("/metrics", data);
  },

  getAll: async () => {
    return apiClient.get<any, Metric[]>("/metrics");
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Metric>(`/metrics/${id}`);
  },

  // Scores
  getJobScores: async (jobId: string) => {
    return apiClient.get<any, any>(`/jobs/${jobId}/scores`);
  },

  getResultScores: async (resultId: string) => {
    return apiClient.get<any, any>(`/results/${resultId}/scores`);
  },
};
