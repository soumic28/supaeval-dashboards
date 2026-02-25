import axios from "axios";

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
    // TODO: Retrieve token from your auth store (e.g., localStorage, Zustand, Context)
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only data for easier consumption
  },
  (error) => {
    // Logging Error
    console.group(
      `❌ API Error: ${error.response?.status} ${error.config?.url}`,
    );
    console.error("Message:", error.message);
    console.error("Response Data:", error.response?.data);
    console.groupEnd();

    // Handle global errors like 401 Unauthorized
    // Note: AuthContext handles 401s by intercepting them and triggering logout.
    // This block is kept for logging purposes or if we want to add non-logout 401 handling later.
    if (error.response?.status === 401) {
      console.warn("Unauthorized - request failed.");
    }

    // Construct a standardized error object
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
      status: error.response?.status,
      original: error,
    };

    return Promise.reject(customError);
  },
);
