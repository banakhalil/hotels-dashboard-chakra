import React, { createContext, useContext, useEffect, useState } from "react";

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
    // Initialize token from localStorage
    return localStorage.getItem("authToken");
  });

  const setToken = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setTokenState(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("authToken");
    setTokenState(null);
  };

  // Effect to sync token with localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken !== token) {
      setTokenState(storedToken);
    }
  }, []);

  const value = {
    token,
    setToken,
    clearToken,
    isAuthenticated: !!token,
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
