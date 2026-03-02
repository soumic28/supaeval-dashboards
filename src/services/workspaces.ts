import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import type { Workspace } from "@/types/models";

export const workspaceService = {
  getAll: async () => {
    logger.debug("workspaceService: Fetching all workspaces");
    try {
      const response = await apiClient.get<any, Workspace[]>("/workspaces");
      logger.info(
        `workspaceService: Successfully fetched ${response.length} workspaces`,
      );
      return response;
    } catch (error) {
      logger.error("workspaceService: Failed to fetch workspaces", error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    logger.debug(`workspaceService: Fetching workspace ${id}`);
    try {
      const response = await apiClient.get<any, Workspace>(`/workspaces/${id}`);
      logger.info(`workspaceService: Successfully fetched workspace ${id}`);
      return response;
    } catch (error) {
      logger.error(`workspaceService: Failed to fetch workspace ${id}`, error);
      throw error;
    }
  },

  create: async (data: Partial<Workspace>) => {
    logger.info(`workspaceService: Creating new workspace: ${data.name}`);
    try {
      const response = await apiClient.post<any, Workspace>(
        "/workspaces",
        data,
      );
      logger.info(
        `workspaceService: Successfully created workspace ${response.id}`,
      );
      return response;
    } catch (error) {
      logger.error("workspaceService: Failed to create workspace", error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Workspace>) => {
    logger.info(`workspaceService: Updating workspace ${id}`);
    try {
      const response = await apiClient.patch<any, Workspace>(
        `/workspaces/${id}`,
        data,
      );
      logger.info(`workspaceService: Successfully updated workspace ${id}`);
      return response;
    } catch (error) {
      logger.error(`workspaceService: Failed to update workspace ${id}`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    logger.info(`workspaceService: Deleting workspace ${id}`);
    try {
      const result = await apiClient.delete(`/workspaces/${id}`);
      logger.info(`workspaceService: Successfully deleted workspace ${id}`);
      return result;
    } catch (error) {
      logger.error(`workspaceService: Failed to delete workspace ${id}`, error);
      throw error;
    }
  },

  // Optional switch workspace if applicable
  switchWorkspace: async (id: string) => {
    logger.info(`workspaceService: Switching to workspace ${id}`);
    try {
      // Primary: standard REST sub-resource
      const result = await apiClient.post(`/workspaces/${id}/switch`, {});
      logger.info(
        `workspaceService: Successfully switched to workspace ${id} (primary)`,
      );
      return result;
    } catch (err) {
      logger.warn(
        `workspaceService: Primary switch endpoint failed for ${id}, trying fallback`,
      );
      // Fallback: common auth-based switch
      try {
        const result = await apiClient.post(`/auth/switch-workspace`, {
          workspace_id: id,
        });
        logger.info(
          `workspaceService: Successfully switched to workspace ${id} (fallback)`,
        );
        return result;
      } catch (fallbackErr) {
        logger.error(
          `workspaceService: All switch attempts failed for workspace ${id}`,
          fallbackErr,
        );
        throw fallbackErr;
      }
    }
  },
};
