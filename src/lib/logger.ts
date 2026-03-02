/**
 * Centralized logging utility for SupaEval Dashboard.
 * Provides consistent formatting and level-based filtering.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private isDevelopment =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.MODE === "development";

  constructor() {
    // This is the FIRST thing that will show up.
    console.warn(
      "%cSupaEval Logger System Loaded",
      "color: #0ea5e9; font-weight: bold; font-size: 14px;",
    );

    // Attach to window for manual debugging in console
    if (typeof window !== "undefined") {
      (window as any).supaLogger = this;
    }
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toLocaleTimeString();
    return `[${timestamp}] [${level.toUpperCase()}] supaeval: ${message}`;
  }

  debug(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message), ...args);
    }
  }

  info(message: string, ...args: any[]) {
    // We use console.log instead of console.info to avoid some browser filters
    console.log(this.formatMessage("info", message), ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(this.formatMessage("warn", message), ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(this.formatMessage("error", message), ...args);
  }

  /**
   * Special method for API logging to keep it structured.
   */
  private maskSensitiveData(data: any): any {
    if (!data || typeof data !== "object") return data;
    const sensitiveFields = [
      "password",
      "token",
      "access_token",
      "refresh_token",
      "api_key",
      "credentials",
    ];
    const masked = { ...data };

    for (const key in masked) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        masked[key] = "********";
      } else if (typeof masked[key] === "object") {
        masked[key] = this.maskSensitiveData(masked[key]);
      }
    }
    return masked;
  }

  logApiRequest(method: string, url: string, data?: any) {
    if (this.isDevelopment) {
      console.groupCollapsed(`🚀 API Request: ${method} ${url}`);
      if (data) console.debug("Payload:", this.maskSensitiveData(data));
      console.groupEnd();
    }
  }

  logApiResponse(method: string, url: string, status: number, data?: any) {
    const icon = status >= 200 && status < 300 ? "✅" : "❌";
    // Always log API responses to help debug production/staging issues, but mask them!
    console.groupCollapsed(`${icon} API Response: ${status} ${method} ${url}`);
    if (data) {
      if (this.isDevelopment) {
        console.info("Data:", this.maskSensitiveData(data));
      } else if (status >= 400) {
        console.error("Error Data:", this.maskSensitiveData(data));
      }
    }
    console.groupEnd();
  }
}

export const logger = new Logger();
