import axios from "axios";

// Create a global Axios instance
export const apiClient = axios.create({
  baseURL: "https://supaeval-backend.azurewebsites.net/v1",
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
    return Promise.reject(error);
  },
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only data for easier consumption
  },
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // TODO: Trigger logout or refresh token flow
      console.warn("Unauthorized - redirecting to login...");
      // window.location.href = '/login'; // Optional: Force redirect
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
