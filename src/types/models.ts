export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

// --- 1. Auth & Identity ---
export interface User {
  id: string;
  email: string;
  name: string;
  role: string; // "admin" | "editor" | "viewer" in UI, generic string in API
  avatar_url?: string;
  tenant_id?: string;
  workspace_id?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ApiKey {
  id: string;
  name: string;
  workspace_id: string;
  prefix: string;
  last_used_at?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  api_key?: string; // Full key, returned only on creation
}

// --- 2. Workspace Management ---
export interface Workspace {
  id: string;
  name: string;
  slug: string; // url-friendly name
  tenant_id?: string; // Tenant association
  is_active?: boolean;
  plan?: string;
  subscription_id?: string;
  created_at: string;
  updated_at: string;
}

// --- 3. Users & Test Users ---
export interface TestUser {
  id: string;
  workspace_id: string;
  name: string; // e.g., "Skeptical Shopper"
  profile: Record<string, any>; // JSON profile
  memory_snapshot?: Record<string, any>;
}

// --- 4. Agent Management ---
export interface Agent {
  id: string;
  workspace_id: string;
  name: string;
  version: string;
  description?: string;
  created_at: string;
  config?: AgentConfig;
}

export interface AgentConfig {
  endpoint_url?: string;
  auth_type?: "none" | "bearer" | "api_key";
  is_multi_turn: boolean;
  use_memory: boolean;
  tools_enabled: boolean;
}

// --- 5. Datasets ---
export interface Dataset {
  // API Fields (Strict)
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  type?: string;
  category?: string;
  human_reviewed?: boolean;
  meta?: Record<string, any>;
  created_at: string;
  updated_at?: string;

  // UI/Mock Fields (Extended for Compatibility)
  title?: string; // Mapped from name
  desc?: string; // Mapped from description
  author?: string;
  price?: string;
  rating?: number;
  size?: string;
  insights?: {
    ambiguity: number;
    noise: number;
    memoryDepth: number;
    toolChains: number;
  };
}

export interface DatasetEntry {
  id: string;
  dataset_id: string;
  input: Record<string, any>;
  expected_output?: Record<string, any>;
  metadata?: Record<string, any>;
}

// --- 6. Eval Configurations ---
export interface EvalProfile {
  id: string;
  name: string;
  description?: string;
  judge_model: string; // e.g., "gpt-4"
  prompt_template: string;
  metrics: string[]; // List of metric IDs
}

// --- 7. Trace Ingestion & 8. Traces ---
export interface Trace {
  trace_id: string;
  workspace_id: string;
  agent_id: string;
  start_ts: number;
  end_ts: number;
  status: "ok" | "error" | "timeout";
  total_tokens?: number;
  latency_ms?: number;
  spans: Span[];
}

export interface Span {
  span_id: string;
  trace_id: string;
  parent_span_id?: string | null;
  name: string;
  layer:
    | "retrieval"
    | "generation"
    | "tool"
    | "planning"
    | "action"
    | "memory"
    | "intent"
    | "system"
    | "input";
  start_ts: number;
  end_ts: number;
  status: "ok" | "error";
  attributes?: Record<string, any>; // Layer specific data
  input?: string;
  output?: string;
  events?: TraceEvent[];
}

export interface TraceEvent {
  event_type: string;
  timestamp: string;
  attributes?: Record<string, any>;
}

export interface TraceIngestRequest {
  sent_at: string; // ISO timestamp
  sdk?: {
    name: string;
    version: string;
    language: string;
  };
  resource?: {
    workspace_id?: string;
    agent_id?: string;
  };
  traces: Trace[];
}

export interface TraceEventIngestRequest {
  run_id: string;
  events: TraceEvent[];
}

// --- 9. Evaluation Jobs ---
export interface EvalJob {
  id: string;
  workspace_id: string;
  type: "online" | "offline";
  status: "pending" | "running" | "completed" | "failed";
  dataset_id?: string;
  model_tested?: string;
  created_at: string;
  completed_at?: string;
  progress: number; // 0-100
}

export interface Run {
  id: string;
  agent_id: string;
  workspace_id: string;
  eval_profile_id?: string;
  status: string;
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  metrics?: Record<string, any>;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RunCreate {
  agent_id: string;
  dataset_id?: string;
  eval_profile_id?: string;
  input_data?: Record<string, any>;
}

export interface RunListResponse {
  items: Run[];
  total: number;
  page: number;
  page_size: number;
}

// --- 10. Eval Results ---
export interface EvalResult {
  id: string;
  job_id: string;
  trace_id?: string;
  dataset_entry_id?: string;
  scores: Record<string, number>; // metric_name -> score
  feedback?: string;
}

// --- 11. Metrics ---
export interface Metric {
  id: string;
  name: string; // e.g., "hallucination_score"
  description?: string;
  range: [number, number]; // e.g., [0, 1]
  higher_is_better: boolean;
}

// --- 12. Budgets ---
export interface Budget {
  id: string;
  workspace_id: string;
  limit_amount: number;
  current_usage: number;
  period: "monthly" | "daily";
  alert_threshold_percent: number;
}

// --- 13. System ---
export interface SystemHealth {
  version: string;
  uptime_seconds: number;
}

// --- 14. Tenants ---
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  settings?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantCreate {
  name: string;
  slug: string;
  settings?: Record<string, any>;
}

export interface TenantUpdate {
  name?: string;
  slug?: string;
  settings?: Record<string, any>;
  is_active?: boolean;
}

// --- 15. Prompts ---
export interface Prompt {
  // API Fields (Strict)
  id: string;
  dataset_id: string;
  prompt_type: string | null;
  prompt_text: string;
  human_reviewed: boolean;
  healthy: boolean;
  expected_output?: string | null;
  prompt_complexity?: string | null;
  created_at: string;
  updated_at: string;

  // UI/Mock Fields
  prompt?: string; // Mapped from prompt_text
  completion?: string; // Mapped from expected_output
  category?: string; // UI only
  reviewed?: boolean; // Mapped from human_reviewed
  complexity?: string; // Mapped from prompt_complexity
  created?: string; // UI formatted date
}

export interface PromptCreate {
  dataset_id: string;
  prompt_type: string;
  prompt_text: string;
  human_reviewed?: boolean;
  healthy?: boolean;
  expected_output?: string;
  prompt_complexity?: string;
}

export interface PromptUpdate {
  prompt_type?: string;
  prompt_text?: string;
  human_reviewed?: boolean;
  healthy?: boolean;
  expected_output?: string;
  prompt_complexity?: string;
}
