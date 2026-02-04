import { apiClient } from "@/lib/api-client";
import type { EvalJob } from "@/types/models";

export const jobService = {
  // Create Jobs
  runOnline: async (data: any) => {
    return apiClient.post<any, EvalJob>("/jobs/online", data);
  },

  runOffline: async (data: any) => {
    return apiClient.post<any, EvalJob>("/jobs/offline", data);
  },

  // Manage Jobs
  getAll: async () => {
    return apiClient.get<any, EvalJob[]>("/jobs");
  },

  getById: async (id: string) => {
    return apiClient.get<any, EvalJob>(`/jobs/${id}`);
  },

  cancel: async (id: string) => {
    return apiClient.post(`/jobs/${id}/cancel`);
  },

  retry: async (id: string) => {
    return apiClient.post(`/jobs/${id}/retry`);
  },
};
