import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoutes";
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
import AirplaneLayout from "./layouts/AirplaneLayout";
import AirplaneDashboard from "./components/Airplanes/AirplaneDashboard";
import Airline from "./components/Airplanes/Airline";
import Airplanes from "./components/Airplanes/Airplanes";
import Flights from "./components/Airplanes/Flights";
import CarsDashboard from "./components/Cars/CarsDashboard";
import CarsLayout from "./layouts/CarsLayout";
import Office from "./components/Cars/Office";
import Cars from "./components/Cars/Cars";
import CarBookings from "./components/Cars/CarBookings";
import TrainDashboard from "./components/Trains/TrainDashboard";
import AirplaneBookings from "./components/Airplanes/AirplaneBookings";
import TripLayout from "./layouts/TripLayout";
import TripDashboard from "./components/Trips/TripDashboard";
import Stays from "./components/Trips/Stays";
import Transport from "./components/Trips/Transport";
import Events from "./components/Trips/Events";
import Trips from "./components/Trips/Trips";
import ManageUsers from "./components/Trips/ManageUsers";
import TripBookings from "./components/Trips/TripBookings";
import AllUsers from "./hooks/Trips/AllUsers";
// import CarOffice from "./components/Cars/CarOffice";
// import Cars from "./components/Cars/Cars";
// import CarBookings from "./components/Cars/CarBookings";

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
      case "officeManager":
        return SelectedPage.CarsDashboard;
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
      case SelectedPage.AirlineDashboard:
        targetPath = "/airline";
        break;
      case SelectedPage.Airlines:
        targetPath = "/airline/airlines";
        break;
      case SelectedPage.Airplanes:
        targetPath = "/airline/airplanes";
        break;
      case SelectedPage.Flights:
        targetPath = "/airline/flights";
        break;
      case SelectedPage.AirlineBookings:
        targetPath = "/airline/airlineBookings";
        break;
      case SelectedPage.CarsDashboard:
        targetPath = "/carOffice";
        break;
      case SelectedPage.Office:
        targetPath = "/carOffice/office";
        break;
      case SelectedPage.Cars:
        targetPath = "/carOffice/cars";
        break;
      case SelectedPage.CarBookings:
        targetPath = "/carOffice/carBookings";
        break;
      case SelectedPage.AdminDashboard:
        targetPath = "/Travelux";
        break;
      case SelectedPage.Events:
        targetPath = "/Travelux/events";
        break;
      case SelectedPage.Packages:
        targetPath = "/Travelux/packages";
        break;
      case SelectedPage.Stays:
        targetPath = "/Travelux/stays";
        break;
      case SelectedPage.Transport:
        targetPath = "/Travelux/transport";
        break;
      case SelectedPage.ManageUsers:
        targetPath = "/Travelux/manageUsers";
        break;
      case SelectedPage.UserBookings:
        targetPath = "/Travelux/userBookings";
        break;
      case SelectedPage.Users:
        targetPath = "/Travelux/users";
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
                <Dashboard />
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
                <TrainDashboard />
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

      {/* Airplane Routes */}
      <Route element={<ProtectedRoute allowedRoles={["airlineOwner"]} />}>
        <Route
          path="/airline/*"
          element={
            <AirplaneLayout
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          }
        >
          <Route
            index
            element={
              <PageSection
                id={SelectedPage.AirlineDashboard}
                setSelectedPage={setSelectedPage}
              >
                <AirplaneDashboard />
              </PageSection>
            }
          />
          <Route
            path="airlines"
            element={
              <PageSection
                id={SelectedPage.Airlines}
                setSelectedPage={setSelectedPage}
              >
                <Airline />
              </PageSection>
            }
          />
          <Route
            path="airplanes"
            element={
              <PageSection
                id={SelectedPage.Airplanes}
                setSelectedPage={setSelectedPage}
              >
                <Airplanes />
              </PageSection>
            }
          />
          <Route
            path="flights"
            element={
              <PageSection
                id={SelectedPage.Flights}
                setSelectedPage={setSelectedPage}
              >
                <Flights />
              </PageSection>
            }
          />
          <Route
            path="airlineBookings"
            element={
              <PageSection
                id={SelectedPage.AirlineBookings}
                setSelectedPage={setSelectedPage}
              >
                <AirplaneBookings />
              </PageSection>
            }
          />
        </Route>
      </Route>

      {/* Car Routes */}
      <Route element={<ProtectedRoute allowedRoles={["officeManager"]} />}>
        <Route
          path="/carOffice/*"
          element={
            <CarsLayout
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          }
        >
          <Route
            index
            element={
              <PageSection
                id={SelectedPage.CarsDashboard}
                setSelectedPage={setSelectedPage}
              >
                <CarsDashboard />
              </PageSection>
            }
          />
          <Route
            path="office"
            element={
              <PageSection
                id={SelectedPage.Office}
                setSelectedPage={setSelectedPage}
              >
                <Office />
              </PageSection>
            }
          />

          <Route
            path="cars"
            element={
              <PageSection
                id={SelectedPage.Cars}
                setSelectedPage={setSelectedPage}
              >
                <Cars />
              </PageSection>
            }
          />

          <Route
            path="carBookings"
            element={
              <PageSection
                id={SelectedPage.CarBookings}
                setSelectedPage={setSelectedPage}
              >
                <CarBookings />
              </PageSection>
            }
          />
        </Route>
      </Route>

      {/* Admin Routes */}

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/Travelux/*"
          element={
            <TripLayout
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          }
        >
          <Route
            index
            element={
              <PageSection
                id={SelectedPage.AdminDashboard}
                setSelectedPage={setSelectedPage}
              >
                <TripDashboard />
              </PageSection>
            }
          />
          <Route
            path="events"
            element={
              <PageSection
                id={SelectedPage.Events}
                setSelectedPage={setSelectedPage}
              >
                <Events />
              </PageSection>
            }
          />

          <Route
            path="packages"
            element={
              <PageSection
                id={SelectedPage.Packages}
                setSelectedPage={setSelectedPage}
              >
                <Trips />
              </PageSection>
            }
          />

          <Route
            path="stays"
            element={
              <PageSection
                id={SelectedPage.Stays}
                setSelectedPage={setSelectedPage}
              >
                <Stays />
              </PageSection>
            }
          />
          <Route
            path="transport"
            element={
              <PageSection
                id={SelectedPage.Transport}
                setSelectedPage={setSelectedPage}
              >
                <Transport />
              </PageSection>
            }
          />
          <Route
            path="manageUsers"
            element={
              <PageSection
                id={SelectedPage.ManageUsers}
                setSelectedPage={setSelectedPage}
              >
                <ManageUsers />
              </PageSection>
            }
          />
          <Route
            path="userBookings"
            element={
              <PageSection
                id={SelectedPage.UserBookings}
                setSelectedPage={setSelectedPage}
              >
                <TripBookings />
              </PageSection>
            }
          />
          <Route
            path="users"
            element={
              <PageSection
                id={SelectedPage.Users}
                setSelectedPage={setSelectedPage}
              >
                <AllUsers />
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
    case "officeManager":
      return <Navigate to="/carOffice" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default AppRoutes;
