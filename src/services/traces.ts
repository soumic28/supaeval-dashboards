import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";

export const traceService = {
  // Ingest full traces (POST /v1/traces/ingest)
  ingest: async (data: { traces: any[]; sdk?: any; resource?: any }) => {
    logger.info(`traceService: Ingesting ${data.traces?.length} traces`);
    try {
      const response = await apiClient.post("/traces/ingest", {
        sent_at: new Date().toISOString(),
        sdk: data.sdk || {
          name: "web-sdk",
          version: "1.0.0",
          language: "typescript",
        },
        resource: data.resource || {},
        traces: data.traces,
      });
      logger.info("traceService: Successful trace ingestion");
      return response;
    } catch (error) {
      logger.error("traceService: Trace ingestion failed", error);
      throw error;
    }
  },

  // Ingest specific events (POST /v1/traces)
  ingestEvents: async (events: any[]) => {
    logger.info(
      `traceService: Ingesting ${events.length} individual trace events`,
    );
    try {
      const response = await apiClient.post("/traces", { events });
      logger.info("traceService: Successful events ingestion");
      return response;
    } catch (error) {
      logger.error("traceService: Events ingestion failed", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    logger.warn(
      `traceService: GET /traces/${id} not fully implemented in backend yet`,
    );
    return { data: {} };
  },

  // Get events for a specific run (GET /v1/traces/runs/{run_id}/events)
  getRunEvents: async (
    runId: string,
    params?: { page?: number; page_size?: number },
  ) => {
    logger.debug(`traceService: Fetching events for run ${runId}`, params);
    try {
      const response = await apiClient.get<any, any>(
        `/traces/runs/${runId}/events`,
        { params },
      );
      logger.info(`traceService: Successfully fetched events for run ${runId}`);
      return response;
    } catch (error) {
      logger.error(
        `traceService: Failed to fetch events for run ${runId}`,
        error,
      );
      throw error;
    }
  },

  /** @deprecated Not in Swagger */
  getByAgent: async (agentId: string) => {
    logger.warn(
      `traceService: getByAgent(${agentId}) called but not found in backend swagger`,
    );
    return { data: [] };
  },
};
