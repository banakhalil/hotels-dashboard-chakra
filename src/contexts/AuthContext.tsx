import React, { createContext, useContext, useEffect, useState } from "react";
import { isTokenExpired, getUserData } from "@/services/authService";
import { useNavigate } from "react-router-dom";

//ADDED
interface User {
  _id: string;
  role:
    | "hotelManager"
    | "routeManager"
    | "airlineOwner"
    | "officeManager"
    | "admin";
  firstName: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  // setToken: (token: string) => void;
  // clearToken: () => void;
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
  isAuthenticated: boolean;
  hasRole: (role: User["role"]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
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

  //ADDED
  const [user, setUser] = useState<User | null>(getUserData());

  // const setToken = (newToken: string) => {
  //   localStorage.setItem("authToken", newToken);
  //   setTokenState(newToken);
  // };

  const setAuthData = (newToken: string, newUser: User) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userData", JSON.stringify(newUser));
    setTokenState(newToken);
    setUser(newUser);
  };

  // const clearToken = () => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("tokenExpiration");
  //   setTokenState(null);
  //   window.location.href = "/login";
  // };

  const clearAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("userData");
    setTokenState(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Effect to check token expiration periodically
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(token)) {
        // clearToken();
        clearAuthData();
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
    // const storedToken = localStorage.getItem("authToken");
    // const storedUser = localStorage.getItem("userData"); //ADDED
    // if (storedToken !== token) {
    //   if (storedToken && isTokenExpired(storedToken)) {
    //     // clearToken();
    //     clearAuthData();
    //   } else {
    //     setTokenState(storedToken);
    //   }
    // }
    //ADDED
    // if (storedUser === user) {
    //   setUser(storedUser ? JSON.parse(storedUser) : null);
    // }
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        if (!e.newValue || isTokenExpired(e.newValue)) {
          clearAuthData();
        } else {
          setTokenState(e.newValue);
        }
      }
      if (e.key === "userData") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
    token,
    // setToken,
    // clearToken,
    user,
    setAuthData,
    clearAuthData,
    isAuthenticated: !!token && !isTokenExpired(token),
    hasRole: (role: User["role"]) => user?.role === role,
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
