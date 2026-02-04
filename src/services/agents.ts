import { apiClient } from "@/lib/api-client";
import type { Agent, AgentConfig } from "@/types/models";

export const agentService = {
  getAll: async () => {
    return apiClient.get<any, Agent[]>("/agents");
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Agent>(`/agents/${id}`);
  },

  create: async (data: Partial<Agent>) => {
    return apiClient.post<any, Agent>("/agents", data);
  },

  update: async (id: string, data: Partial<Agent>) => {
    return apiClient.patch<any, Agent>(`/agents/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/agents/${id}`);
  },

  // Configuration
  getConfig: async (agentId: string) => {
    return apiClient.get<any, AgentConfig>(`/agents/${agentId}/config`);
  },

  updateConfig: async (agentId: string, data: AgentConfig) => {
    return apiClient.patch<any, AgentConfig>(`/agents/${agentId}/config`, data);
  },
};
