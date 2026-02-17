import { apiClient } from "@/lib/api-client";
import type { User, TestUser } from "@/types/models";

export const userService = {
  // Human Users
  create: async (data: any) => {
    // Uses form-urlencoded content type as per Swagger
    return apiClient.post<any, User>("/admin/user-create", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },

  getAll: async () => {
    // return apiClient.get<any, User[]>("/users");
    console.warn("API does not support /users yet");
    return { data: [] };
  },

  updateProfile: async (_id: string, _data: Partial<User>) => {
    // return apiClient.patch<any, User>(`/users/${id}`, data);
    console.warn("API does not support /users update yet");
    return { data: {} };
  },

  // Test Users (Personas) - Endpoint not in OpenAPI
  getTestUsers: async (_workspaceId: string) => {
    // return apiClient.get<any, TestUser[]>(
    //   `/workspaces/${workspaceId}/test-users`,
    // );
    console.warn("API does not support /test-users yet");
    return { data: [] };
  },

  createTestUser: async (_workspaceId: string, _data: Partial<TestUser>) => {
    // return apiClient.post<any, TestUser>(
    //   `/workspaces/${workspaceId}/test-users`,
    //   data,
    // );
    console.warn("API does not support /test-users create yet");
    return { data: {} };
  },

  updateTestUser: async (_id: string, _data: Partial<TestUser>) => {
    // return apiClient.patch<any, TestUser>(`/test-users/${id}`, data);
    console.warn("API does not support /test-users update yet");
    return { data: {} };
  },

  deleteTestUser: async (_id: string) => {
    // return apiClient.delete(`/test-users/${id}`);
    console.warn("API does not support /test-users delete yet");
    return { data: {} };
  },
};
