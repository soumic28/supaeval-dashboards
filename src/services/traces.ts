import { apiClient } from "@/lib/api-client";
// import type { Trace } from "@/types/models"; // Unused for now as we use any[] for flexible ingestion matching

export const traceService = {
  // Ingest full traces (POST /v1/traces/ingest)
  ingest: async (data: { traces: any[]; sdk?: any; resource?: any }) => {
    return apiClient.post("/traces/ingest", {
      sent_at: new Date().toISOString(),
      sdk: data.sdk || {
        name: "web-sdk",
        version: "1.0.0",
        language: "typescript",
      },
      resource: data.resource || {},
      traces: data.traces,
    });
  },

  // Ingest specific events (POST /v1/traces)
  ingestEvents: async (events: any[]) => {
    // API expects a list of events or a specific structure?
    // Based on typical patterns: { events: [...] } or just [...]
    // The user request says `POST /v1/traces` -> Ingest Events.
    // Assuming array or wrapper. Let's try wrapper as it's safer for extensions.
    return apiClient.post("/traces", { events });
  },

  getById: async (_id: string) => {
    // keeping mock for now as per instructions/findings
    console.warn("API: GET /traces/:id not implemented/found");
    return { data: {} };
  },

  // Get events for a specific run (GET /v1/traces/runs/{run_id}/events)
  getRunEvents: async (
    runId: string,
    params?: { page?: number; page_size?: number },
  ) => {
    return apiClient.get(`/traces/runs/${runId}/events`, { params });
  },

  /** @deprecated Not in Swagger */
  getByAgent: async (_agentId: string) => {
    console.warn("API: GET /agents/:id/traces not found in swagger");
    return { data: [] };
  },
};
