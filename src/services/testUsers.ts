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

export const testUserService = {
  create: async (agentId: string, user: TestUser) => {
    const payload = mapTestUserToCreateRequest(agentId, user);
    const response = await apiClient.post<any, TestUserResponse>(
      "/test-users/test-users/",
      payload,
    );
    return response;
  },
};
