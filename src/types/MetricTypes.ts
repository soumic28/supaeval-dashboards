export type MetricType = "LLM-as-Judge" | "Comparison" | "Algo";

export interface CustomMetric {
  id: string;
  name: string;
  type: MetricType;
  judgingPrompt: string;
}

export interface CustomLayer {
  id: string;
  name: string;
  metrics: CustomMetric[];
}

export interface MetricSet {
  id: number;
  name: string;
  type: string;
  count: number;
  updated: string;
  layers: CustomLayer[];
}

export interface DefaultMetricTemplate {
  name: string;
  type: MetricType;
  judgingPrompt: string;
  description?: string;
}

export interface DefaultLayerTemplate {
  name: string;
  metrics: DefaultMetricTemplate[];
}
