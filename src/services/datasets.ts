import { apiClient } from "@/lib/api-client";
import type { Dataset, DatasetEntry } from "@/types/models";

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

  delete: async (id: string) => {
    return apiClient.delete(`/datasets/${id}`);
  },

  // Entries
  getEntries: async (datasetId: string) => {
    return apiClient.get<any, DatasetEntry[]>(`/datasets/${datasetId}/entries`);
  },

  addEntry: async (datasetId: string, data: Partial<DatasetEntry>) => {
    return apiClient.post<any, DatasetEntry>(
      `/datasets/${datasetId}/entries`,
      data,
    );
  },

  deleteEntry: async (datasetId: string, entryId: string) => {
    return apiClient.delete(`/datasets/${datasetId}/entries/${entryId}`);
  },
};
