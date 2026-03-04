import { SeverityLevel } from "@microsoft/applicationinsights-web";
import { appInsights } from "../services/appInsights";

/**
 * Reusable logging wrapper for Azure Application Insights.
 * This ensures the rest of the application remains decoupled from the SDK.
 */
export const logger = {
  /**
   * Log an exception/error.
   */
  error: (error: Error | string, properties?: Record<string, unknown>) => {
    const exception = typeof error === "string" ? new Error(error) : error;
    appInsights.trackException({
      exception,
      properties,
      severityLevel: SeverityLevel.Error,
    });

    // Fallback to console for development visibility
    if (import.meta.env.DEV) {
      console.error("[AppInsights Error]", error, properties);
    }
  },

  /**
   * Log a custom event.
   */
  event: (name: string, properties?: Record<string, unknown>) => {
    appInsights.trackEvent({
      name,
      properties,
    });

    if (import.meta.env.DEV) {
      console.log(`[AppInsights Event: ${name}]`, properties);
    }
  },

  /**
   * Log a trace message.
   */
  trace: (
    message: string,
    properties?: Record<string, unknown>,
    severity: SeverityLevel = SeverityLevel.Information,
  ) => {
    appInsights.trackTrace({
      message,
      properties,
      severityLevel: severity,
    });

    if (import.meta.env.DEV) {
      console.log(`[AppInsights Trace] ${message}`, properties);
    }
  },

  /**
   * Log a numeric metric.
   */
  metric: (
    name: string,
    average: number,
    properties?: Record<string, unknown>,
  ) => {
    appInsights.trackMetric({
      name,
      average,
      properties,
    });

    if (import.meta.env.DEV) {
      console.log(`[AppInsights Metric: ${name}]`, average, properties);
    }
  },
};
