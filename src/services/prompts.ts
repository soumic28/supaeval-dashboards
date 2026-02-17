import { apiClient } from "@/lib/api-client";
import type { Prompt, PromptCreate, PromptUpdate } from "@/types/models";

export const promptService = {
  getAll: async (datasetId: string) => {
    return apiClient.get<any, Prompt[]>("/prompts", {
      params: { dataset_id: datasetId },
    });
  },

  getOne: async (id: string) => {
    return apiClient.get<any, Prompt>(`/prompts/${id}`);
  },

  create: async (data: PromptCreate | PromptCreate[]) => {
    return apiClient.post<any, Prompt[]>("/prompts", data);
  },

  update: async (id: string, data: PromptUpdate) => {
    // Explicitly send fields, even if undefined (though JSON.stringify removes them usually, axios might not)
    return apiClient.patch<any, Prompt>(`/prompts/${id}`, data);
  },

  delete: async (id: string) => {
    console.log(`[PromptService] Deleting ${id}`);
    return apiClient.delete(`/prompts/${id}`);
  },
};
