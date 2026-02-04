import { apiClient } from "@/lib/api-client";
import type { AuthResponse, ApiKey } from "@/types/models";

export const authService = {
  login: async (credentials: { email: string; password?: string }) => {
    return apiClient.post<any, AuthResponse>("/auth/login", credentials);
  },

  logout: async () => {
    return apiClient.post("/auth/logout");
  },

  refreshToken: async () => {
    return apiClient.post<any, AuthResponse>("/auth/refresh-token");
  },

  // API Keys
  createApiKey: async (data: { name: string; workspace_id: string }) => {
    return apiClient.post<any, ApiKey>("/auth/api-keys", data);
  },

  getApiKeys: async () => {
    return apiClient.get<any, ApiKey[]>("/auth/api-keys");
  },

  deleteApiKey: async (keyId: string) => {
    return apiClient.delete(`/auth/api-keys/${keyId}`);
  },
};
