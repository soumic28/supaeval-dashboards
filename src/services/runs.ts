import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import type { Run, RunListResponse, RunCreate } from "@/types/models";

export const runService = {
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    agent_id?: string;
    status?: string;
  }) => {
    logger.debug("runService: Fetching all runs", params);
    try {
      const response = await apiClient.get<any, RunListResponse>("/runs", {
        params,
      });
      logger.info(
        `runService: Successfully fetched runs (total: ${response.total})`,
      );
      return response;
    } catch (error) {
      logger.error("runService: Failed to fetch runs", error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    logger.debug(`runService: Fetching run ${id}`);
    try {
      const response = await apiClient.get<any, Run>(`/runs/${id}`);
      logger.info(`runService: Successfully fetched run ${id}`);
      return response;
    } catch (error) {
      logger.error(`runService: Failed to fetch run ${id}`, error);
      throw error;
    }
  },

  create: async (data: RunCreate) => {
    logger.info("runService: Creating new run", data);
    try {
      const response = await apiClient.post<any, Run>("/runs", data);
      logger.info(`runService: Successfully created run ${response.id}`);
      return response;
    } catch (error) {
      logger.error("runService: Failed to create run", error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Run>) => {
    logger.info(`runService: Updating run ${id}`);
    try {
      const response = await apiClient.patch<any, Run>(`/runs/${id}`, data);
      logger.info(`runService: Successfully updated run ${id}`);
      return response;
    } catch (error) {
      logger.error(`runService: Failed to update run ${id}`, error);
      throw error;
    }
  },
};
