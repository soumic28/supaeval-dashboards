import { apiClient } from "@/lib/api-client";
import type { EvalProfile } from "@/types/models";

export const evalConfigService = {
  getAll: async () => {
    return apiClient.get<any, EvalProfile[]>("/eval-profiles");
  },

  getOne: async (id: string) => {
    return apiClient.get<any, EvalProfile>(`/eval-profiles/${id}`);
  },

  create: async (data: Partial<EvalProfile>) => {
    return apiClient.post<any, EvalProfile>("/eval-profiles", data);
  },

  update: async (id: string, data: Partial<EvalProfile>) => {
    return apiClient.patch<any, EvalProfile>(`/eval-profiles/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/eval-profiles/${id}`);
  },
};
