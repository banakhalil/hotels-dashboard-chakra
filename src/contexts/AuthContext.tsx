import React, { createContext, useContext, useEffect, useState } from "react";
import { isTokenExpired } from "@/services/authService";

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(() => {
    // Initialize token from localStorage and check expiration
    if (typeof window === "undefined") return null;

    const storedToken = localStorage.getItem("authToken");
    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiration");
      return null;
    }
    return storedToken;
  });

  const setToken = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setTokenState(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiration");
    setTokenState(null);
    window.location.href = "/login";
  };

  // Effect to check token expiration periodically
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(token)) {
        clearToken();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Then check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [token]);

  // Effect to sync token with localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken !== token) {
      if (storedToken && isTokenExpired(storedToken)) {
        clearToken();
      } else {
        setTokenState(storedToken);
      }
    }
  }, []);

  const value = {
    token,
    setToken,
    clearToken,
    isAuthenticated: !!token && !isTokenExpired(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// For development/testing, you can set a default token
export const setDefaultToken = (token: string) => {
  localStorage.setItem("authToken", token);
};
