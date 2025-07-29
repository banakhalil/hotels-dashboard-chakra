import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: Array<
    "hotelManager" | "routeManager" | "airlineOwner" | "officeManager" | "admin"
  >;
  redirectPath?: string;
}

export const ProtectedRoute = ({
  allowedRoles = [],
  redirectPath = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
