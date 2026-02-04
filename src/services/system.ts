import { apiClient } from "@/lib/api-client";
import type { SystemHealth } from "@/types/models";

export const systemService = {
  getHealth: async () => {
    return apiClient.get<any, SystemHealth>("/system/health");
  },

  getVersion: async () => {
    return apiClient.get<any, { version: string }>("/system/version");
  },

  getAuditLogs: async () => {
    return apiClient.get<any, any[]>("/audit/logs");
  },
};
