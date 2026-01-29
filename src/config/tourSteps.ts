export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right";
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="dashboard"]',
    title: "👋 Welcome to SupaEval!",
    content:
      "This is your dashboard where you can monitor AI agent performance, evaluation runs, and quality metrics at a glance.",
    placement: "bottom",
  },
  {
    target: '[data-tour="sidebar"]',
    title: "🧭 Navigate Your Workspace",
    content:
      "Use the sidebar to access Datasets, Evaluations, Benchmarks, and more. Everything you need is just a click away.",
    placement: "right",
  },
  {
    target: '[data-tour="evaluations"]',
    title: "🎯 Run Evaluations",
    content:
      "Create and run evaluations to test your AI agents. Monitor their performance and identify areas for improvement.",
    placement: "right",
  },
  {
    target: '[data-tour="datasets"]',
    title: "📊 Manage Datasets",
    content:
      "Access your datasets, browse the marketplace, or create synthetic data for testing your AI agents.",
    placement: "right",
  },
  {
    target: '[data-tour="search"]',
    title: "🔍 Quick Search",
    content:
      "Press K anytime to open quick search. Find pages, evaluations, and datasets instantly.",
    placement: "bottom",
  },
  {
    target: '[data-tour="settings"]',
    title: "⚙️ Settings & Team",
    content:
      "Customize your preferences, invite team members, and manage your account from Settings.",
    placement: "left",
  },
];
