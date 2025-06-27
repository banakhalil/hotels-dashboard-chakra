import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { ColorModeProvider } from "./components/ui/color-mode";
import { useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Auth/Login";
import Dashboard from "./components/Hotels/HotelDashboard";
import Hotels from "./components/Hotels/Hotels";
import ShowRooms from "./components/Hotels/Rooms/ShowRooms";
import HotelBookings from "./components/Hotels/HotelBookings";
import AllStations from "./components/Trains/AllStations";
import AllTrains from "./components/Trains/AllTrains";
import AllRoutes from "./components/Trains/AllRoutes";
import TrainTrips from "./components/Trains/AllTrainTrips";
import { useEffect, useState } from "react";
import { SelectedPage } from "./shared/types";
import HotelLayout from "./layouts/HotelLayout";
import TrainLayout from "./layouts/TrainLayout";
import PageSection from "./components/PageSection";

const AppRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Set initial selectedPage based on user role without navigation
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(() => {
    if (!user) return SelectedPage.HotelDashboard;

    switch (user.role) {
      case "hotelManager":
        return SelectedPage.HotelDashboard;
      case "routeManager":
        return SelectedPage.TrainDashboard;
      case "airlineOwner":
        return SelectedPage.AirlineDashboard;
      case "admin":
        return SelectedPage.AdminDashboard;
      default:
        return SelectedPage.HotelDashboard;
    }
  });

  // Handle navigation for sidebar clicks
  useEffect(() => {
    if (!user) return;

    let targetPath = "/login";
    switch (selectedPage) {
      case SelectedPage.HotelDashboard:
        targetPath = "/hotel";
        break;
      case SelectedPage.TrainDashboard:
        targetPath = "/train";
        break;
      case SelectedPage.Hotels:
        targetPath = "/hotel/hotels";
        break;
      case SelectedPage.Rooms:
        targetPath = "/hotel/rooms";
        break;
      case SelectedPage.Bookings:
        targetPath = "/hotel/bookings";
        break;
      case SelectedPage.Stations:
        targetPath = "/train/stations";
        break;
      case SelectedPage.Trains:
        targetPath = "/train/trains";
        break;
      case SelectedPage.Routes:
        targetPath = "/train/routes";
        break;
      case SelectedPage.Trips:
        targetPath = "/train/traintrips";
        break;
    }

    // Only navigate if we're not already on the target path
    if (window.location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [selectedPage, navigate, user]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Hotel Routes */}
      <Route element={<ProtectedRoute allowedRoles={["hotelManager"]} />}>
        <Route
          path="/hotel/*"
          element={
            <HotelLayout
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          }
        >
          <Route
            index
            element={
              <PageSection
                id={SelectedPage.HotelDashboard}
                setSelectedPage={setSelectedPage}
              >
                <Dashboard setSelectedPage={setSelectedPage} />
              </PageSection>
            }
          />
          <Route
            path="hotels"
            element={
              <PageSection
                id={SelectedPage.Hotels}
                setSelectedPage={setSelectedPage}
              >
                <Hotels
                  setSelectedPage={setSelectedPage}
                  setSelectedHotelId={setSelectedHotelId}
                />
              </PageSection>
            }
          />
          <Route
            path="rooms"
            element={
              <PageSection
                id={SelectedPage.Rooms}
                setSelectedPage={setSelectedPage}
              >
                <ShowRooms hotelId={selectedHotelId} />
              </PageSection>
            }
          />
          <Route
            path="bookings"
            element={
              <PageSection
                id={SelectedPage.Bookings}
                setSelectedPage={setSelectedPage}
              >
                <HotelBookings />
              </PageSection>
            }
          />
        </Route>
      </Route>

      {/* Train Routes */}
      <Route element={<ProtectedRoute allowedRoles={["routeManager"]} />}>
        <Route
          path="/train/*"
          element={
            <TrainLayout
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          }
        >
          <Route
            index
            element={
              <PageSection
                id={SelectedPage.TrainDashboard}
                setSelectedPage={setSelectedPage}
              >
                <Dashboard setSelectedPage={setSelectedPage} />
              </PageSection>
            }
          />
          <Route
            path="stations"
            element={
              <PageSection
                id={SelectedPage.Stations}
                setSelectedPage={setSelectedPage}
              >
                <AllStations />
              </PageSection>
            }
          />
          <Route
            path="trains"
            element={
              <PageSection
                id={SelectedPage.Trains}
                setSelectedPage={setSelectedPage}
              >
                <AllTrains />
              </PageSection>
            }
          />
          <Route
            path="routes"
            element={
              <PageSection
                id={SelectedPage.Routes}
                setSelectedPage={setSelectedPage}
              >
                <AllRoutes />
              </PageSection>
            }
          />
          <Route
            path="traintrips"
            element={
              <PageSection
                id={SelectedPage.Trips}
                setSelectedPage={setSelectedPage}
              >
                <TrainTrips />
              </PageSection>
            }
          />
        </Route>
      </Route>

      {/* Default redirect based on role */}
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "hotelManager":
      return <Navigate to="/hotel" replace />;
    case "routeManager":
      return <Navigate to="/train" replace />;
    case "airlineOwner":
      return <Navigate to="/airline" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default AppRoutes;
