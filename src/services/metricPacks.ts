import { apiClient } from "@/lib/api-client";

export interface MetricPackConfig {
  id?: string;
  name: string;
  description?: string;
  evaluation_scope: string;
  version: string;
  is_active: boolean;
  tags?: string[];
  fail_threshold?: number;
  aggregation_method?: string;
  workspace_id?: string;
  config_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MetricPackCreateRequest {
  metric_pack: {
    name: string;
    description?: string;
    evaluation_scope: string;
    is_active: boolean;
    version?: string;
  };
  preset?: string;
  options?: {
    fail_closed?: boolean;
    judge_model?: string;
    language?: string;
  };
  layers?: any[];
  defaults?: Record<string, any>;
}

export interface MetricPackResponse {
  id: string;
  version: string;
  layer_ids: string[];
  metric_ids: string[];
  evaluator_ids: string[];
}

export interface MetricPackListResponse {
  items: MetricPackConfig[];
  total: number;
  page: number;
  page_size: number;
}

// Assuming these interfaces are defined elsewhere or will be added
export interface MetricPackVersion {
  id: string;
  version: string;
  // ... other properties
}

export interface MetricPackResolved {
  // ... properties of a resolved metric pack config
}

export const metricPacksService = {
  /**
   * Get all metric packs with optional filtering and pagination
   */
  async getAll(params?: {
    scope?: string;
    is_active?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<MetricPackListResponse> {
    const response = await apiClient.get("/metric-packs", { params });
    return response as unknown as MetricPackListResponse;
  },

  /**
   * Get a single metric pack by ID with optional hydration
   */
  async getById(
    id: string,
    hydrate: boolean = false,
  ): Promise<MetricPackResponse> {
    const response = await apiClient.get(`/metric-packs/${id}`, {
      params: { hydrate },
    });
    return response as unknown as MetricPackResponse;
  },

  /**
   * Create a new metric pack (supports preset and full manual mode)
   */
  async create(data: MetricPackCreateRequest): Promise<MetricPackResponse> {
    const response = await apiClient.post("/metric-packs", data);
    return response as unknown as MetricPackResponse;
  },

  /**
   * Update a metric pack via PATCH (partial update)
   */
  async update(
    id: string,
    data: Partial<MetricPackConfig>,
  ): Promise<MetricPackResponse> {
    const response = await apiClient.patch(`/metric-packs/${id}`, data);
    return response as unknown as MetricPackResponse;
  },

  /**
   * Get all versions of a metric pack
   */
  async getVersions(id: string): Promise<MetricPackVersion[]> {
    const response = await apiClient.get(`/metric-packs/${id}/versions`);
    return response as unknown as MetricPackVersion[];
  },

  /**
   * Create a new version for a metric pack
   */
  async createVersion(
    id: string,
    data: Partial<MetricPackConfig>,
  ): Promise<MetricPackVersion> {
    const response = await apiClient.post(`/metric-packs/${id}/versions`, data);
    return response as unknown as MetricPackVersion;
  },

  /**
   * Get the resolved configuration for a specific version
   */
  async getResolvedVersion(
    id: string,
    version: string,
  ): Promise<MetricPackResolved> {
    const response = await apiClient.get(
      `/metric-packs/${id}/versions/${version}`,
    );
    return response as unknown as MetricPackResolved;
  },
};
