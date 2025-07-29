import React, { createContext, useContext } from "react";
import useAirlines from "@/hooks/Airlines/useAirlines";

interface AirlinesContextType {
  airline:
    | {
        _id: string;
        name: string;
        country: string;
        description: string;
        logo: string;
        destinationCountries: string;
        planesNum: number;
      }
    | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AirlinesContext = createContext<AirlinesContextType | undefined>(
  undefined
);

export const AirlinesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: airline, isLoading, error } = useAirlines();

  return (
    <AirlinesContext.Provider value={{ airline, isLoading, error }}>
      {children}
    </AirlinesContext.Provider>
  );
};

export const useAirlinesContext = () => {
  const context = useContext(AirlinesContext);
  if (context === undefined) {
    throw new Error(
      "useAirlinesContext must be used within a AirlinesProvider"
    );
  }
  return context;
};
