import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import type { User, TestUser } from "@/types/models";

export const userService = {
  // Human Users
  create: async (data: any) => {
    logger.info("userService: Creating new admin user", data);
    try {
      // Uses form-urlencoded content type as per Swagger
      const response = await apiClient.post<any, User>(
        "/admin/user-create",
        data,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );
      logger.info(
        `userService: Successfully created admin user ${response.id}`,
      );
      return response;
    } catch (error) {
      logger.error("userService: Failed to create admin user", error);
      throw error;
    }
  },

  getAll: async () => {
    logger.warn("userService: API does not support /users yet");
    return { data: [] };
  },

  updateProfile: async (id: string, _data: Partial<User>) => {
    logger.warn(
      `userService: API does not support profile update for ${id} yet`,
    );
    return { data: {} };
  },

  // Test Users (Personas) - Endpoint not in OpenAPI
  getTestUsers: async (workspaceId: string) => {
    logger.warn(
      `userService: API does not support /test-users for workspace ${workspaceId} yet`,
    );
    return { data: [] };
  },

  createTestUser: async (workspaceId: string, data: Partial<TestUser>) => {
    logger.warn(
      `userService: API does not support /test-users creation for workspace ${workspaceId} yet`,
      data,
    );
    return { data: {} };
  },

  updateTestUser: async (id: string, _data: Partial<TestUser>) => {
    logger.warn(
      `userService: API does not support /test-users update for ${id} yet`,
    );
    return { data: {} };
  },

  deleteTestUser: async (id: string) => {
    logger.warn(
      `userService: API does not support /test-users delete for ${id} yet`,
    );
    return { data: {} };
  },
};
