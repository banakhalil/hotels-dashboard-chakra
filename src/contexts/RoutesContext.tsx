import React, { createContext, useContext } from "react";
import useRoutes, { type Route } from "@/hooks/Trains/useRoutes";

interface RoutesContextType {
  routes: Route[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading, error } = useRoutes();

  // Flatten all routes from all loaded pages
  const routes = data ? data.pages.flatMap((page) => page.routes) : undefined;

  return (
    <RoutesContext.Provider value={{ routes, isLoading, error }}>
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutesContext = () => {
  const context = useContext(RoutesContext);
  if (context === undefined) {
    throw new Error("useRoutesContext must be used within a RoutesProvider");
  }
  return context;
};
