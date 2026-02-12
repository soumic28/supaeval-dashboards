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

export interface Agent {
  id: number;
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
}

export interface AgentTemplate {
  name: string;
  category: AgentCategory;
  description: string;
  defaultConfig?: Record<string, any>;
  defaultEndpoints?: AgentEndpoint[];
  defaultAuth?: AgentAuth;
}
