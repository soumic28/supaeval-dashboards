import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { apiClient } from "@/lib/api-client";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import type { User, AuthResponse } from "@/types/models";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password?: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Initialize auth state
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");

        if (storedToken) {
            setToken(storedToken);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                    localStorage.removeItem("auth_user");
                }
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: { email: string; password?: string }) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            // The API response is directly the AuthResponse object (interceptors handle .data)
            const data = response as unknown as AuthResponse;

            if (data.access_token) {
                localStorage.setItem("auth_token", data.access_token);
                setToken(data.access_token);

                // Setup user if returned, otherwise we might need to fetch profile
                if (data.user) {
                    localStorage.setItem("auth_user", JSON.stringify(data.user));
                    setUser(data.user);
                }
            }
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshProfile = async () => {
        try {
            const response = await authService.getProfile();
            console.log("AuthContext: refreshProfile response:", response);
            // The API likely returns just the user object or an AuthResponse structure. 
            // Adjust based on actual API. Assuming it returns user for now or AuthResponse.
            const data = response as unknown as any;
            const userProfile = data.user || data; // Handle both cases
            console.log("AuthContext: parsed userProfile:", userProfile);

            if (userProfile && userProfile.id) {
                localStorage.setItem("auth_user", JSON.stringify(userProfile));
                setUser(userProfile);
            } else {
                console.warn("AuthContext: refreshProfile did not return a valid user object", data);
            }
        } catch (error) {
            console.error("Failed to refresh profile", error);
        }
    };

    const updateUser = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
    };

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            setToken(null);
            setUser(null);
            navigate("/login");
        }
    }, [navigate]);

    // 401 Interceptor Setup
    useEffect(() => {
        // Add interceptor to handle 401s globally
        const interceptorId = apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status || error.status;
                if (status === 401) {
                    console.warn("Unauthorized - logging out...");
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.response.eject(interceptorId);
        };
    }, [logout]);

    // Auto-logout hook
    useAutoLogout(logout, !!token && !!user);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
                refreshProfile,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
