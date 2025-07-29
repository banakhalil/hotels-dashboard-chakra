import { type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { TrainsProvider } from "./TrainsContext";
import { StationsProvider } from "./StationsContext";
import { RoutesProvider } from "./RoutesContext";
import { AirlinesProvider } from "./AirlinesContext";

interface RoleBasedProviderProps {
  children: ReactNode;
}

const RouteManagerProviders = ({ children }: { children: ReactNode }) => (
  <TrainsProvider>
    <StationsProvider>
      <RoutesProvider>{children}</RoutesProvider>
    </StationsProvider>
  </TrainsProvider>
);

const HotelManagerProviders = ({ children }: { children: ReactNode }) => (
  // Add hotel-related providers here when they're created
  <>{children}</>
);

const AirlineOwnerProviders = ({ children }: { children: ReactNode }) => (
  // Add airline-related providers here when they're created
  <AirlinesProvider>{children}</AirlinesProvider>
);
const OfficeManagerProviders = ({ children }: { children: ReactNode }) => (
  // Add hotel-related providers here when they're created
  <>{children}</>
);

const AdminProviders = ({ children }: { children: ReactNode }) => (
  // Admin might need access to all contexts
  <TrainsProvider>
    <StationsProvider>
      <RoutesProvider>
        {/* Add other providers as needed */}
        {children}
      </RoutesProvider>
    </StationsProvider>
  </TrainsProvider>
);

export const RoleBasedProvider = ({ children }: RoleBasedProviderProps) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  switch (user.role) {
    case "routeManager":
      return <RouteManagerProviders>{children}</RouteManagerProviders>;
    case "hotelManager":
      return <HotelManagerProviders>{children}</HotelManagerProviders>;
    case "airlineOwner":
      return <AirlineOwnerProviders>{children}</AirlineOwnerProviders>;
    case "officeManager":
      return <OfficeManagerProviders>{children}</OfficeManagerProviders>;
    case "admin":
      return <AdminProviders>{children}</AdminProviders>;
    default:
      return <>{children}</>;
  }
};
