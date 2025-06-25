// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./contexts/AuthContext";
// import { ColorModeProvider } from "./components/ui/color-mode";
// import { useState } from "react";
// import { SelectedPage } from "./shared/types";
// import { useBreakpointValue } from "@chakra-ui/react";
// import NavBar from "./components/NavBar";
// import SideBar, { SideBarItem } from "./components/SideBar";
// import { Settings, LayoutDashboard } from "lucide-react";
// import { LuCalendarCheck } from "react-icons/lu";
// import { MdOutlineBedroomParent } from "react-icons/md";
// import { LiaHotelSolid } from "react-icons/lia";
// import Dashboard from "./components/Dashboard";
// import Hotels from "./components/Hotels/Hotels";
// import { Login } from "./components/Auth/Login";
// import PageSection from "./components/PageSection";
// import ShowRooms from "./components/Hotels/Rooms/ShowRooms";
// import HotelBookings from "./components/Hotels/HotelBookings";
// import AllStations from "./components/Trains/AllStations";
// import AllTrains from "./components/Trains/AllTrains";
// import AllRoutes from "./components/Trains/AllRoutes";
// import TrainTrips from "./components/Trains/TrainTrips";

// // Protected Route wrapper
// const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth();
//   const [expanded, setExpanded] = useState(true);
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const isMobile = useBreakpointValue({ base: true, md: false });
//   const [selectedPage, setSelectedPage] = useState<SelectedPage>(
//     SelectedPage.Dashboard
//   );
//   const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   const toggleSidebar = () => {
//     if (isMobile) {
//       setSidebarOpen(!isSidebarOpen);
//     } else {
//       setExpanded(!expanded);
//     }
//   };

//   return (
//     <ColorModeProvider>
//       <div className="flex h-screen w-full overflow-hidden p-4">
//         {/* Sidebar */}
//         <div
//           className={`transition-all duration-300 ease-in-out ${
//             isMobile ? "w-0" : expanded ? "w-64" : "w-20"
//           }`}
//         >
//           <SideBar
//             expanded={expanded}
//             isOpen={isSidebarOpen}
//             onClose={() => setSidebarOpen(false)}
//           >
//             <SideBarItem
//               icon={<LayoutDashboard size={20} />}
//               text="Dashboard"
//               selectedPage={selectedPage}
//               setSelectedPage={setSelectedPage}
//             />
//             <SideBarItem
//               icon={<LiaHotelSolid size={20} />}
//               text="Hotels"
//               selectedPage={selectedPage}
//               setSelectedPage={setSelectedPage}
//             />
//             <SideBarItem
//               icon={<MdOutlineBedroomParent size={20} />}
//               text="Rooms"
//               selectedPage={selectedPage}
//               setSelectedPage={setSelectedPage}
//             />
//             <SideBarItem
//               icon={<LuCalendarCheck size={20} />}
//               text="Bookings"
//               selectedPage={selectedPage}
//               setSelectedPage={setSelectedPage}
//             />
//           </SideBar>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col ml-4">
//           <NavBar onToggleSidebar={toggleSidebar} title={selectedPage} />
//           <main className="flex-1 overflow-y-auto scroll-smooth">
//             {/* <PageSection
//               id={SelectedPage.Dashboard}
//               setSelectedPage={setSelectedPage}
//             >
//               <Dashboard setSelectedPage={setSelectedPage} />
//             </PageSection>

//             <PageSection
//               id={SelectedPage.Hotels}
//               setSelectedPage={setSelectedPage}
//             >
//               <Hotels
//                 setSelectedPage={setSelectedPage}
//                 setSelectedHotelId={setSelectedHotelId}
//               />
//             </PageSection>

//             <PageSection
//               id={SelectedPage.Rooms}
//               setSelectedPage={setSelectedPage}
//             >
//               <ShowRooms hotelId={selectedHotelId} />
//             </PageSection>

//             <PageSection
//               id={SelectedPage.Bookings}
//               setSelectedPage={setSelectedPage}
//             >
//               <HotelBookings />
//             </PageSection> */}
//             <PageSection
//               id={SelectedPage.Dashboard}
//               setSelectedPage={setSelectedPage}
//             >
//               <AllStations />
//             </PageSection>
//             <PageSection
//               id={SelectedPage.Hotels}
//               setSelectedPage={setSelectedPage}
//             >
//               <AllTrains />
//             </PageSection>
//             <PageSection
//               id={SelectedPage.Rooms}
//               setSelectedPage={setSelectedPage}
//             >
//               <AllRoutes />
//             </PageSection>
//             <PageSection
//               id={SelectedPage.Bookings}
//               setSelectedPage={setSelectedPage}
//             >
//               <TrainTrips />
//             </PageSection>
//           </main>
//         </div>
//       </div>
//     </ColorModeProvider>
//   );
// };

// // Redirect authenticated users from login page
// const PublicRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={
//           <PublicRoute>
//             <Login />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/*"
//         element={
//           <ProtectedLayout>
//             <Dashboard setSelectedPage={() => {}} />
//           </ProtectedLayout>
//         }
//       />
//     </Routes>
//   );
// };

// export default AppRoutes;

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { ColorModeProvider } from "./components/ui/color-mode";
import { useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Auth/Login";
import Dashboard from "./components/Dashboard";
import Hotels from "./components/Hotels/Hotels";
import ShowRooms from "./components/Hotels/Rooms/ShowRooms";
import HotelBookings from "./components/Hotels/HotelBookings";
import AllStations from "./components/Trains/AllStations";
import AllTrains from "./components/Trains/AllTrains";
import AllRoutes from "./components/Trains/AllRoutes";
import TrainTrips from "./components/Trains/TrainTrips";
import { useEffect, useState } from "react";
import { SelectedPage } from "./shared/types";
import HotelLayout from "./layouts/HotelLayout";
import TrainLayout from "./layouts/TrainLayout";
import PageSection from "./components/PageSection";

const AppRoutes = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Dashboard
  );
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // if (selectedPage === SelectedPage.Dashboard) {
    //   navigate("/hotel");
    // } else
    if (selectedPage === SelectedPage.Hotels) {
      navigate("/hotel/hotels");
    } else if (selectedPage === SelectedPage.Rooms) {
      navigate("/hotel/rooms");
    } else if (selectedPage === SelectedPage.Bookings) {
      navigate("/hotel/bookings");
    } else if (selectedPage === SelectedPage.Stations) {
      navigate("/train/stations");
    } else if (selectedPage === SelectedPage.Trains) {
      navigate("/train/trains");
    } else if (selectedPage === SelectedPage.Routes) {
      navigate("/train/routes");
    } else if (selectedPage === SelectedPage.Trips) {
      navigate("/train/traintrips");
    }
    // Add other pages as needed
  }, [selectedPage, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

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
                id={SelectedPage.Dashboard}
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
                id={SelectedPage.Dashboard}
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
    </Routes>
  );
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "hotelManager":
      return <Navigate to="/hotel/" replace />;
    case "routeManager":
      return <Navigate to="/train" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default AppRoutes;
