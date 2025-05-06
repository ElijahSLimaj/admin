// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "@/api/auth";

export type User = {
  id: string;
  name: string;
  email: string;
  // any other fields you need
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("accessToken");
  });
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      // assume response has { accessToken, refreshToken, user }
      const { accessToken, refreshToken, user: userData } = response;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        throw new Error("Login response missing tokens");
      }
    } catch (err: any) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(err.message || "Login failed");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await apiRegister(email, password);
      // Optionally you can auto‐login or fetch user after register
    } catch (err: any) {
      throw new Error(err.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
