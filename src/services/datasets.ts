import { apiClient } from "@/lib/api-client";
import type { Dataset } from "@/types/models";

export const datasetService = {
  // Datasets
  getAll: async () => {
    return apiClient.get<any, Dataset[]>("/datasets");
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Dataset>(`/datasets/${id}`);
  },

  create: async (data: Partial<Dataset>) => {
    return apiClient.post<any, Dataset>("/datasets", data);
  },

  update: async (id: string | number, data: Partial<Dataset>) => {
    return apiClient.patch<any, Dataset>(`/datasets/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/datasets/${id}`);
  },

  // Entries endpoints removed as they are not in OpenAPI spec
  // Use promptService for prompts related to a dataset
};
