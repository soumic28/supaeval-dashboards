import { apiClient } from "@/lib/api-client";
import type { AuthResponse, ApiKey } from "@/types/models";

export const authService = {
  login: async (credentials: { email: string; password?: string }) => {
    return apiClient.post<any, AuthResponse>("/auth/login", credentials);
  },

  logout: async () => {
    return apiClient.post("/auth/logout");
  },

  getProfile: async () => {
    return apiClient.get<any, AuthResponse>("/auth/me");
  },

  refreshToken: async () => {
    return apiClient.post<any, AuthResponse>("/auth/refresh-token");
  },

  // API Keys
  createApiKey: async (data: { name: string; expires_at?: string | null }) => {
    return apiClient.post<any, ApiKey & { api_key: string }>("/auth/api-keys", {
      name: data.name,
      expires_at: data.expires_at,
    });
  },

  getApiKeys: async () => {
    return apiClient.get<any, ApiKey[]>("/auth/api-keys");
  },

  deleteApiKey: async (keyId: string) => {
    return apiClient.delete(`/auth/api-keys/${keyId}`);
  },
};
