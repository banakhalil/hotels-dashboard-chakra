import React, { createContext, useContext } from "react";
import useTrains, { type TrainData } from "@/hooks/useTrains";

interface TrainsContextType {
  trains: TrainData[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const TrainsContext = createContext<TrainsContextType | undefined>(undefined);

export const TrainsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: trains, isLoading, error } = useTrains();

  return (
    <TrainsContext.Provider value={{ trains, isLoading, error }}>
      {children}
    </TrainsContext.Provider>
  );
};

export const useTrainsContext = () => {
  const context = useContext(TrainsContext);
  if (context === undefined) {
    throw new Error("useTrainsContext must be used within a TrainsProvider");
  }
  return context;
};
