import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import type { User, AuthResponse } from "@/types/models";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password?: string }) => Promise<void>;
    logout: () => Promise<void>;
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

    const logout = async () => {
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
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
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
