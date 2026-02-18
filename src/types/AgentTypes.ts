export type AgentStatus = "Active" | "Idle" | "Offline" | "Error";
export type AgentCategory = "Development" | "Staging" | "Production";

export interface AgentEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
}

export interface AgentAuth {
  type: "none" | "client_credentials";
  clientId?: string;
  clientSecret?: string;
}

export interface TestUser {
  id: string;
  name: string;
  email: string;
}

export interface AgentMemory {
  id: string;
  key: string;
  value: string;
}

// Internal UI Model
export interface Agent {
  id: string; // Changed from number to string
  name: string;
  category: AgentCategory;
  description?: string;
  status: AgentStatus;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  configuration?: Record<string, any>;
  endpoints?: AgentEndpoint[];
  auth?: AgentAuth;
  parallelRuns?: number;
  testUsers?: TestUser[];
  memories?: AgentMemory[];
}

export interface AgentTemplate {
  name: string;
  category: AgentCategory;
  description: string;
  defaultConfig?: Record<string, any>;
  defaultEndpoints?: AgentEndpoint[];
  defaultAuth?: AgentAuth;
}

// --- API DTOs (Strictly matching OpenAPI & Backward Compatibility) ---

// Matches models.ts AgentConfig
export interface AgentBackendConfig {
  endpoint_url?: string;
  auth_type?: "none" | "bearer" | "api_key" | "client_credentials"; // Extended slightly for frontend types
  is_multi_turn: boolean;
  use_memory: boolean;
  tools_enabled: boolean;
  // We can try to send extra fields here, but if it fails, we rely on metadata
  [key: string]: any;
}

export interface AgentCreateRequest {
  name: string;
  description?: string;
  agent_type: string; // Maps to category
  configuration?: AgentBackendConfig;
  metadata?: {
    // We store the full frontend state here to persist it safely
    frontend_details?: {
      endpoints?: AgentEndpoint[];
      auth?: AgentAuth;
      parallel_runs?: number;
      test_users?: TestUser[];
      memories?: AgentMemory[];
    };
    last_active?: string;
    status?: AgentStatus;
    [key: string]: any;
  };
}

export interface AgentUpdateRequest {
  name?: string;
  description?: string;
  configuration?: AgentBackendConfig;
  metadata?: {
    frontend_details?: {
      endpoints?: AgentEndpoint[];
      auth?: AgentAuth;
      parallel_runs?: number;
      test_users?: TestUser[];
      memories?: AgentMemory[];
    };
    last_active?: string;
    status?: AgentStatus;
    [key: string]: any;
  };
  is_active?: boolean;
}

export interface AgentResponse {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  agent_type: string;
  configuration?: AgentBackendConfig;
  metadata?: {
    frontend_details?: {
      endpoints?: AgentEndpoint[];
      auth?: AgentAuth;
      parallel_runs?: number;
      test_users?: TestUser[];
      memories?: AgentMemory[];
    };
    last_active?: string;
    status?: AgentStatus;
    [key: string]: any;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
