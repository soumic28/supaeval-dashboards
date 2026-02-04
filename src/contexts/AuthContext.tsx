import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types/models";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password?: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USER: User = {
    id: "mock-user-123",
    email: "demo@supaeval.com",
    name: "Demo User",
    role: "admin",
    created_at: new Date().toISOString(),
};

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
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock successful login
            const mockToken = "mock-jwt-token-" + Date.now();

            // Use the credential email if provided, otherwise default to mock user email
            const loggedInUser = {
                ...MOCK_USER,
                email: credentials.email || MOCK_USER.email
            };

            localStorage.setItem("auth_token", mockToken);
            localStorage.setItem("auth_user", JSON.stringify(loggedInUser));

            setToken(mockToken);
            setUser(loggedInUser);

        } catch (error) {
            console.error("Login failed", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // No backend call needed for mock auth
            // await authService.logout(); 
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
