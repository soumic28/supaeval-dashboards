import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { logger as appLogger } from "@/utils/logger";
import { setUserContext, clearUserContext } from "./appInsights";
import type { AuthResponse, ApiKey } from "@/types/models";

export const authService = {
  login: async (credentials: { email: string; password?: string }) => {
    logger.debug(`authService: Attempting login for ${credentials.email}`);
    appLogger.event("LoginAttempt", { email: credentials.email });

    try {
      const result = await apiClient.post<any, AuthResponse>(
        "/auth/login",
        credentials,
      );
      logger.info(`authService: Login successful for ${credentials.email}`);

      // Azure AppInsights User Context & Event
      if (result.user?.id) {
        setUserContext(result.user.id);
      }
      appLogger.event("LoginSuccess", {
        email: credentials.email,
        userId: result.user?.id,
      });

      return result;
    } catch (error) {
      logger.error(`authService: Login failed for ${credentials.email}`, error);
      appLogger.event("LoginFailure", {
        email: credentials.email,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },

  signup: async (credentials: {
    email: string;
    password?: string;
    name?: string;
  }) => {
    logger.info(`authService: Attempting signup for ${credentials.email}`);
    appLogger.event("SignupAttempt", { email: credentials.email });

    try {
      const result = await apiClient.post<any, any>(
        "/auth/signup",
        credentials,
      );
      logger.info(`authService: Signup successful for ${credentials.email}`);

      // Azure AppInsights User Context & Event
      if (result.user?.id) {
        setUserContext(result.user.id);
      }
      appLogger.event("SignupSuccess", {
        email: credentials.email,
        userId: result.user?.id,
      });

      return result;
    } catch (error) {
      logger.error(
        `authService: Signup failed for ${credentials.email}`,
        error,
      );
      appLogger.event("SignupFailure", {
        email: credentials.email,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  },

  logout: async () => {
    logger.info("authService: Executing backend logout");
    try {
      const result = await apiClient.post("/auth/logout");
      logger.info("authService: Backend logout successful");

      // Clear Azure AppInsights User Context
      clearUserContext();
      appLogger.event("Logout");

      return result;
    } catch (error) {
      logger.error("authService: Backend logout failed", error);
      throw error;
    }
  },

  getProfile: async () => {
    logger.debug("authService: Fetching current profile");
    try {
      const result = await apiClient.get<any, AuthResponse>("/auth/me");
      logger.debug("authService: Profile fetched successfully");
      return result;
    } catch (error) {
      logger.error("authService: Failed to fetch profile", error);
      throw error;
    }
  },

  refreshToken: async () => {
    logger.debug("authService: Refreshing session token");
    try {
      const result = await apiClient.post<any, AuthResponse>(
        "/auth/refresh-token",
      );
      logger.info("authService: Token refreshed successfully");
      return result;
    } catch (error) {
      logger.error("authService: Token refresh failed", error);
      throw error;
    }
  },

  // API Keys
  createApiKey: async (data: { name: string; expires_at?: string | null }) => {
    logger.info(`authService: Creating API key "${data.name}"`);
    try {
      const result = await apiClient.post<any, ApiKey & { api_key: string }>(
        "/auth/api-keys",
        {
          name: data.name,
          expires_at: data.expires_at,
        },
      );
      logger.info(`authService: API key "${data.name}" created successfully`);
      return result;
    } catch (error) {
      logger.error(
        `authService: Failed to create API key "${data.name}"`,
        error,
      );
      throw error;
    }
  },

  getApiKeys: async () => {
    logger.debug("authService: Fetching API keys");
    try {
      const result = await apiClient.get<any, ApiKey[]>("/auth/api-keys");
      logger.info(
        `authService: Successfully fetched ${result.length} API keys`,
      );
      return result;
    } catch (error) {
      logger.error("authService: Failed to fetch API keys", error);
      throw error;
    }
  },

  deleteApiKey: async (keyId: string) => {
    logger.info(`authService: Deleting API key ${keyId}`);
    try {
      const result = await apiClient.delete(`/auth/api-keys/${keyId}`);
      logger.info(`authService: API key ${keyId} deleted successfully`);
      return result;
    } catch (error) {
      logger.error(`authService: Failed to delete API key ${keyId}`, error);
      throw error;
    }
  },
};
