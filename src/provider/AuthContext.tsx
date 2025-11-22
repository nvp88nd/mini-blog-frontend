import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosClient from "../api/axiosClient";

interface User {
    id: string;
    email: string;
    username: string;
    avatar_url: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
            fetchUser(savedToken);
        }
        else {
            setLoading(false);
        }

        const syncAuth = () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setUser(null);
                setToken(null);
                delete axiosClient.defaults.headers.common["Authorization"];
                return;
            } else {
                setToken(token);
                axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                fetchUser(token);
            }
        };

        window.addEventListener("storage", syncAuth);

        return () => {
            window.removeEventListener("storage", syncAuth);
        };
    }, []);

    const fetchUser = async (authToken: string) => {
        try {
            const response = await axiosClient.get("/auth/me", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await axiosClient.post("/auth/login", { email, password });
        const { user: userData, session } = response.data;

        setUser(userData);
        setToken(session.access_token);
        localStorage.setItem("token", session.access_token);
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${session.access_token}`;
    };

    const register = async (email: string, username: string, password: string) => {
        const response = await axiosClient.post("/auth/register", { email, username, password });
        const { user: userData, session } = response.data;

        setUser(userData);
        setToken(session.access_token);
        localStorage.setItem("token", session.access_token);
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${session.access_token}`;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        delete axiosClient.defaults.headers.common["Authorization"];
    };

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}