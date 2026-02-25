import { apiClient } from "@/lib/api-client";
import type { MetricResponse } from "@/services/metrics";

export interface LayerCreateRequest {
  name: string;
  description: string;
  evaluation_scope: string;
  is_active: boolean;
}

export interface LayerResponse extends LayerCreateRequest {
  id: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  metrics?: MetricResponse[];
}

export const layerService = {
  create: async (data: LayerCreateRequest) => {
    return apiClient.post<any, LayerResponse>("/layers/", data);
  },

  getAll: async () => {
    // API returns a paginated structure: { items: [...], total, page, page_size }
    const response = await apiClient.get<any, { items?: LayerResponse[] }>(
      "/layers/",
    );
    return response?.items || [];
  },

  delete: async (layerId: string) => {
    return apiClient.delete(`/layers/${layerId}`);
  },

  update: async (layerId: string, data: Partial<LayerCreateRequest>) => {
    return apiClient.patch<any, LayerResponse>(`/layers/${layerId}`, data);
  },
};
