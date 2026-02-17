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
  // Optional switch workspace if applicable
  switchWorkspace: async (id: string) => {
    try {
      // Primary: standard REST sub-resource
      return await apiClient.post(`/workspaces/${id}/switch`, {});
    } catch (err) {
      console.warn(
        "Primary switch endpoint failed, trying fallback /auth/switch-workspace",
      );
      // Fallback: common auth-based switch
      return await apiClient.post(`/auth/switch-workspace`, {
        workspace_id: id,
      });
    }
  },
};
