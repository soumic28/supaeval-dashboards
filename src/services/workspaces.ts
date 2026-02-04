import { apiClient } from "@/lib/api-client";
import type { Workspace } from "@/types/models";

export const workspaceService = {
  getAll: async () => {
    return apiClient.get<any, Workspace[]>("/workspaces");
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Workspace>(`/workspaces/${id}`);
  },

  create: async (data: Partial<Workspace>) => {
    return apiClient.post<any, Workspace>("/workspaces", data);
  },

  update: async (id: string, data: Partial<Workspace>) => {
    return apiClient.patch<any, Workspace>(`/workspaces/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/workspaces/${id}`);
  },

  // Optional switch workspace if applicable
  switchWorkspace: async (id: string) => {
    return apiClient.post(`/workspaces/${id}/switch`);
  },
};
