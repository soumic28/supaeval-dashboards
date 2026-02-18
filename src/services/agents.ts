import { apiClient } from "@/lib/api-client";
import type {
  Agent,
  AgentResponse,
  AgentCreateRequest,
  AgentUpdateRequest,
  AgentCategory,
  AgentStatus,
} from "@/types/AgentTypes";

// Mappers
const mapDtoToAgent = (dto: AgentResponse): Agent => {
  // Try to get data from metadata.frontend_details first (rich state),
  // fallback to configuration (basic state)
  const frontendDetails = dto.metadata?.frontend_details || {};

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    category: (dto.agent_type as AgentCategory) || "Development",
    status:
      (dto.metadata?.status as AgentStatus) ||
      (dto.is_active ? "Active" : "Offline"),
    lastActive: dto.metadata?.last_active || "Unknown",
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    endpoints: frontendDetails.endpoints || [], // Restore full endpoints list
    auth: frontendDetails.auth,
    parallelRuns: frontendDetails.parallel_runs,
    testUsers: frontendDetails.test_users || [],
    memories: frontendDetails.memories || [],
    configuration: dto.configuration, // Keep raw config just in case
  };
};

const mapAgentToCreateRequest = (agent: Partial<Agent>): AgentCreateRequest => {
  // Flatten for backend safety
  const primaryEndpoint = agent.endpoints?.[0];

  return {
    name: agent.name || "New Agent",
    description: agent.description,
    agent_type: agent.category || "Development",
    // conform to strict backend model
    configuration: {
      endpoint_url: primaryEndpoint?.url || "",
      auth_type: (agent.auth?.type as any) || "none",
      is_multi_turn: true,
      use_memory: (agent.memories?.length || 0) > 0,
      tools_enabled: true,
    },
    metadata: {
      // Store the REAL state here so we get it back
      frontend_details: {
        endpoints: agent.endpoints,
        auth: agent.auth,
        parallel_runs: agent.parallelRuns,
        test_users: agent.testUsers,
        memories: agent.memories,
      },
      last_active: "Just now",
      status: "Active",
    },
  };
};

const mapAgentToUpdateRequest = (agent: Partial<Agent>): AgentUpdateRequest => {
  const primaryEndpoint = agent.endpoints?.[0];

  return {
    name: agent.name,
    description: agent.description,
    configuration: {
      endpoint_url: primaryEndpoint?.url || "",
      auth_type: (agent.auth?.type as any) || "none",
      is_multi_turn: true,
      use_memory: (agent.memories?.length || 0) > 0,
      tools_enabled: true,
    },
    metadata: {
      frontend_details: {
        endpoints: agent.endpoints,
        auth: agent.auth,
        parallel_runs: agent.parallelRuns,
        test_users: agent.testUsers,
        memories: agent.memories,
      },
      last_active: agent.lastActive,
      status: agent.status,
    },
    is_active: agent.status !== "Offline" && agent.status !== "Error",
  };
};

export const agentService = {
  getAll: async () => {
    const response = await apiClient.get<any, AgentResponse[]>("/agents");
    return response.map(mapDtoToAgent);
  },

  getOne: async (id: string) => {
    const response = await apiClient.get<any, AgentResponse>(`/agents/${id}`);
    return mapDtoToAgent(response);
  },

  create: async (data: Partial<Agent>) => {
    const payload = mapAgentToCreateRequest(data);
    const response = await apiClient.post<any, AgentResponse>(
      "/agents",
      payload,
    );
    return mapDtoToAgent(response);
  },

  update: async (id: string, data: Partial<Agent>) => {
    const payload = mapAgentToUpdateRequest(data);
    const response = await apiClient.patch<any, AgentResponse>(
      `/agents/${id}`,
      payload,
    );
    return mapDtoToAgent(response);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/agents/${id}`);
  },
};
