import { apiClient } from "@/lib/api-client";

export interface MetricCreateRequest {
  name: string;
  metric_type: string;
  judging_prompt: string;
  is_active: boolean;
  layer_id: string;
}

export interface MetricResponse extends MetricCreateRequest {
  id: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export const metricService = {
  create: async (data: MetricCreateRequest) => {
    return apiClient.post<any, MetricResponse>("/metrics/", data);
  },

  delete: async (metricId: string) => {
    return apiClient.delete(`/metrics/${metricId}`);
  },

  update: async (metricId: string, data: Partial<MetricCreateRequest>) => {
    return apiClient.patch<any, MetricResponse>(`/metrics/${metricId}`, data);
  },

  getOne: async (id: string) => {
    return apiClient.get<any, MetricResponse>(`/metrics/${id}`);
  },

  // Scores
  getJobScores: async (jobId: string) => {
    return apiClient.get<any, any>(`/jobs/${jobId}/scores`);
  },

  getResultScores: async (resultId: string) => {
    return apiClient.get<any, any>(`/results/${resultId}/scores`);
  },
};
