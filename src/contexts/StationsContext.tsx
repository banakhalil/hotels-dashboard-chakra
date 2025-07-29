import React, { createContext, useContext } from "react";
import type { StationData } from "@/hooks/Trains/useStations";
import useStations from "@/hooks/Trains/useStations";

interface StationsContextType {
  stations: StationData[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const StationsContext = createContext<StationsContextType | undefined>(
  undefined
);

export const StationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: stations, isLoading, error } = useStations();

  return (
    <StationsContext.Provider value={{ stations, isLoading, error }}>
      {children}
    </StationsContext.Provider>
  );
};

export const useStationsContext = () => {
  const context = useContext(StationsContext);
  if (context === undefined) {
    throw new Error(
      "useStationsContext must be used within a StationsProvider"
    );
  }
  return context;
};
