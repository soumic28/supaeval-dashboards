import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "./components/theme-provider"
import { AppInsightsErrorBoundary } from "./components/ErrorBoundary"
import { logger as appLogger } from "./utils/logger";
import { logger } from "@/lib/logger";

// Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Startup Log - Should be visible if 'Info' is enabled in console
logger.info(`SupaEval Dashboard starting up in ${import.meta.env.MODE} mode`);

// Global Error Handlers for AppInsights
window.onerror = (message, source, lineno, colno, error) => {
  appLogger.error(error || message.toString(), {
    source,
    lineno,
    colno,
    type: 'window.onerror'
  });
};

window.onunhandledrejection = (event) => {
  appLogger.error(event.reason || 'Unhandled Promise Rejection', {
    type: 'unhandledrejection'
  });
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppInsightsErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </AppInsightsErrorBoundary>
  </StrictMode>,
)
