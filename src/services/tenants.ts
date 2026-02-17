import { apiClient } from "@/lib/api-client";
import type { Tenant, TenantCreate, TenantUpdate } from "@/types/models";

export const tenantService = {
  getAll: async (params?: { skip?: number; limit?: number }) => {
    return apiClient.get<any, Tenant[]>("/tenants/", { params });
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Tenant>(`/tenants/${id}`);
  },

  create: async (data: TenantCreate) => {
    return apiClient.post<any, Tenant>("/tenants/", data);
  },

  update: async (id: string, data: TenantUpdate) => {
    return apiClient.patch<any, Tenant>(`/tenants/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/tenants/${id}`);
  },
};
