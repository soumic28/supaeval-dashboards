import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { logger } from "./logger";

// Create a global Axios instance
export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://supaeval-backend.azurewebsites.net/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s timeout for robustness
});

// Request Interceptor: Auto-attach Authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request
    logger.logApiRequest(
      config.method?.toUpperCase() || "GET",
      config.url || "",
      config.data,
    );

    return config;
  },
  (error) => {
    logger.error("❌ API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    logger.logApiResponse(
      response.config.method?.toUpperCase() || "GET",
      response.config.url || "",
      response.status,
      response.data,
    );
    return response.data; // Return only data for easier consumption
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    // Log API error
    logger.logApiResponse(
      method || "UNKNOWN",
      url || "UNKNOWN",
      status || 0,
      error.response?.data || error.message,
    );

    // Handle global errors like 401 Unauthorized
    if (status === 401) {
      logger.warn(`Unauthorized access to ${url} - triggering logout logic`);
    }

    // Construct a standardized error object
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
      status: status,
      original: error,
    };

    toast({
      variant: "destructive",
      title: "Error",
      description: customError.message,
    });

    return Promise.reject(customError);
  },
);
