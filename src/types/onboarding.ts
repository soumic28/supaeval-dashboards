export type OnboardingData = {
  apiKey: string;
  tracesCollected: number;
  adapterConfidence: number;
  agentMode: "RAG Agent" | "Chat Agent" | "Router Agent";
};
