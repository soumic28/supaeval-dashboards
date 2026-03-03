import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { apiClient } from "@/lib/api-client";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import { logger } from "@/lib/logger";
import type { User, AuthResponse } from "@/types/models";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password?: string }) => Promise<void>;
    signup: (credentials: { email: string; password?: string; name?: string }) => Promise<void>;
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
            logger.debug("AuthContext: Found stored token, initializing session");
            setToken(storedToken);
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    logger.info(`AuthContext: User session restored for ${parsedUser.email || parsedUser.id}`);
                } catch (e) {
                    logger.error("AuthContext: Failed to parse stored user", e);
                    localStorage.removeItem("auth_user");
                }
            }
        } else {
            logger.debug("AuthContext: No stored token found");
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: { email: string; password?: string }) => {
        logger.info(`AuthContext: Login attempt for ${credentials.email}`);
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            // The API response is directly the AuthResponse object (interceptors handle .data)
            const data = response as unknown as AuthResponse;

            if (data.access_token) {
                logger.info("AuthContext: Login successful, storing token");
                localStorage.setItem("auth_token", data.access_token);
                setToken(data.access_token);

                // Setup user if returned, otherwise we might need to fetch profile
                if (data.user) {
                    logger.debug("AuthContext: User data received in login response", data.user);
                    localStorage.setItem("auth_user", JSON.stringify(data.user));
                    setUser(data.user);
                }
            } else {
                logger.warn("AuthContext: Login response missing access_token");
            }
        } catch (error: any) {
            logger.error(`AuthContext: Login failed for ${credentials.email}`, error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (credentials: { email: string; password?: string; name?: string }) => {
        logger.info(`AuthContext: Signup attempt for ${credentials.email}`);
        setIsLoading(true);
        try {
            await authService.signup(credentials);
            logger.info(`AuthContext: Signup successful for ${credentials.email}`);
            // Automatically log in the user after successful signup
            if (credentials.email && credentials.password) {
                await login({ email: credentials.email, password: credentials.password });
            }
        } catch (error: any) {
            logger.error(`AuthContext: Signup failed for ${credentials.email}`, error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshProfile = async () => {
        logger.debug("AuthContext: Refreshing user profile");
        try {
            const response = await authService.getProfile();
            // The API likely returns just the user object or an AuthResponse structure. 
            // Adjust based on actual API. Assuming it returns user for now or AuthResponse.
            const data = response as unknown as any;
            const userProfile = data.user || data; // Handle both cases

            if (userProfile && userProfile.id) {
                logger.info("AuthContext: Profile refreshed successfully");
                localStorage.setItem("auth_user", JSON.stringify(userProfile));
                setUser(userProfile);
            } else {
                logger.warn("AuthContext: refreshProfile did not return a valid user object", data);
            }
        } catch (error) {
            logger.error("AuthContext: Failed to refresh profile", error);
        }
    };

    const updateUser = (newUser: User) => {
        logger.debug("AuthContext: Manually updating user object", newUser);
        setUser(newUser);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
    };

    const logout = useCallback(async () => {
        logger.info("AuthContext: Logging out user");
        try {
            await authService.logout();
            logger.debug("AuthContext: Backend logout call completed");
        } catch (error) {
            logger.error("AuthContext: Backend logout call failed", error);
        } finally {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            setToken(null);
            setUser(null);
            logger.info("AuthContext: User session cleared, navigating to login");
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
                    logger.warn("AuthContext: 401 Unauthorized detected - triggering global logout");
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
                signup,
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
