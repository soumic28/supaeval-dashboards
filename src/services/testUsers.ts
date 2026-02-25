import { apiClient } from "@/lib/api-client";
import type {
  TestUserCreateRequest,
  TestUserResponse,
  TestUser,
} from "@/types/AgentTypes";

const mapTestUserToCreateRequest = (
  agentId: string,
  user: TestUser,
): TestUserCreateRequest => {
  return {
    user_id: user.name, // Username
    persona_type:
      user.attributes?.userType?.toLowerCase().replace(/\s+/g, "_") || "fresh",
    context: user.context ? { details: user.context } : {},
    session_chat_history: user.attributes?.chatHistory
      ? [user.attributes.chatHistory]
      : [],
    long_term_memory: {
      memory: user.memory,
      longTermMem: user.attributes?.longTermMem,
    },
    attributes: {
      riskLevel: user.attributes?.riskLevel,
      queryComplexity: user.attributes?.queryComplexity,
      intentType: user.attributes?.intentType,
    },
    is_active: true,
    agent_id: agentId,
  };
};

const mapResponseToTestUser = (dto: TestUserResponse): TestUser => {
  return {
    id: dto.id,
    name: dto.user_id, // Username
    context: dto.context?.details || "",
    memory: dto.long_term_memory?.memory || "",
    attributes: {
      chatHistory: dto.session_chat_history?.[0] || "",
      longTermMem: dto.long_term_memory?.longTermMem || "",
      userType: dto.persona_type,
      riskLevel: dto.attributes?.riskLevel,
      queryComplexity: dto.attributes?.queryComplexity,
      intentType: dto.attributes?.intentType,
    },
  };
};

export const testUserService = {
  create: async (agentId: string, user: TestUser) => {
    const payload = mapTestUserToCreateRequest(agentId, user);
    const response = await apiClient.post<any, TestUserResponse>(
      "/test-users/test-users/",
      payload,
    );
    return mapResponseToTestUser(response);
  },

  update: async (agentId: string, testUserId: string, user: TestUser) => {
    // We assume backend has a PUT or PATCH for updates
    const payload = mapTestUserToCreateRequest(agentId, user);
    const response = await apiClient.put<any, TestUserResponse>(
      `/test-users/test-users/${testUserId}`,
      payload,
    );
    return mapResponseToTestUser(response);
  },

  listByAgentId: async (agentId: string) => {
    // Assuming backend filters by agent_id query param
    const response = await apiClient.get<any, TestUserResponse[]>(
      `/test-users/test-users/?agent_id=${agentId}`,
    );
    return (response || []).map(mapResponseToTestUser);
  },

  delete: async (testUserId: string) => {
    // Assuming backend follows standard REST mapping based on the POST endpoint
    return apiClient.delete(`/test-users/test-users/${testUserId}`);
  },
};
