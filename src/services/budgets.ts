import { apiClient } from "@/lib/api-client";
import type { Budget } from "@/types/models";

export const budgetService = {
  create: async (data: Partial<Budget>) => {
    return apiClient.post<any, Budget>("/budgets", data);
  },

  getAll: async () => {
    return apiClient.get<any, Budget[]>("/budgets");
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Budget>(`/budgets/${id}`);
  },

  update: async (id: string, data: Partial<Budget>) => {
    return apiClient.patch<any, Budget>(`/budgets/${id}`, data);
  },

  // System Limits
  getLimits: async () => {
    return apiClient.get<any, any>("/system/limits");
  },
};
