import { apiClient } from "@/lib/api-client";
import type { Run, RunListResponse, RunCreate } from "@/types/models";

export const runService = {
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    agent_id?: string;
    status?: string;
  }) => {
    return apiClient.get<any, RunListResponse>("/runs", { params });
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Run>(`/runs/${id}`);
  },

  create: async (data: RunCreate) => {
    return apiClient.post<any, Run>("/runs", data);
  },

  update: async (id: string, data: Partial<Run>) => {
    return apiClient.patch<any, Run>(`/runs/${id}`, data);
  },
};
