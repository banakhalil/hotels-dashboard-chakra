import { Grid, GridItem, Tooltip, TooltipArrow } from "@chakra-ui/react";
import "./index.css";
import NavBar from "./components/NavBar";
import { ColorModeProvider } from "./components/ui/color-mode";
import SideBar, { SideBarItem } from "./components/SideBar";
import {
  Settings,
  LayoutDashboard,
  BarChart3,
  UserCircle,
  Package,
  Boxes,
  Receipt,
  LifeBuoy,
} from "lucide-react";
import { useState } from "react";
import { SelectedPage } from "./shared/types";
import { Box, useBreakpointValue } from "@chakra-ui/react";

import { LuCalendarCheck } from "react-icons/lu"; //booking
import { IoCalendarNumberOutline } from "react-icons/io5"; //calendar
import { MdOutlineBedroomParent } from "react-icons/md"; //rooms
import { PiMoneyDuotone } from "react-icons/pi"; //money/financials
import { MdOutlineHelpCenter } from "react-icons/md"; //help
import { LiaHotelSolid } from "react-icons/lia"; //hotels
import Dashboard from "./components/Dashboard";
import Hotels from "./components/Hotels/Hotels";
import { CardHotels, CardHotelsDetails } from "./components/Hotels/CardHotels";
import { useSpecificHotel } from "./components/react-query/hooks/useHotels";
import { UpdateHotel } from "./components/Hotels/UpdateHotel";
import { useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Auth/Login";
import PageSection from "./components/PageSection";

function App() {
  const [expanded, setExpanded] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Dashboard
  );
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setExpanded(!expanded);
    }
  };

  if (!isAuthenticated) {
    return (
      <ColorModeProvider>
        <Login />
      </ColorModeProvider>
    );
  }

  return (
    <ColorModeProvider>
      <div className="flex h-screen w-full overflow-hidden p-4">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isMobile ? "w-0" : expanded ? "w-64" : "w-20"
          }`}
        >
          <SideBar
            expanded={expanded}
            isOpen={isSidebarOpen}
            onClose={() => setSidebarOpen(false)}
          >
            <SideBarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<LiaHotelSolid size={20} />}
              text="Hotels"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<MdOutlineBedroomParent size={20} />}
              text="Rooms"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<LuCalendarCheck size={20} />}
              text="Bookings"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<PiMoneyDuotone size={20} />}
              text="Financials"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<Settings size={20} />}
              text="Settings"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<MdOutlineHelpCenter size={20} />}
              text="Help"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </SideBar>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-4">
          <NavBar onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto">
            {/* <Dashboard setSelectedPage={setSelectedPage} />
          <Hotels setSelectedPage={setSelectedPage} /> */}
            <PageSection
              id={SelectedPage.Dashboard}
              setSelectedPage={setSelectedPage}
            >
              <Dashboard setSelectedPage={setSelectedPage} />
            </PageSection>

            <PageSection
              id={SelectedPage.Hotels}
              setSelectedPage={setSelectedPage}
            >
              <Hotels setSelectedPage={setSelectedPage} />
            </PageSection>

            {/* Add more sections as needed */}
            <PageSection
              id={SelectedPage.Rooms}
              setSelectedPage={setSelectedPage}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Rooms</h2>
                <p>Rooms management coming soon...</p>
              </div>
            </PageSection>

            <PageSection
              id={SelectedPage.Bookings}
              setSelectedPage={setSelectedPage}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Bookings</h2>
                <p>Bookings management coming soon...</p>
              </div>
            </PageSection>

            <PageSection
              id={SelectedPage.Financials}
              setSelectedPage={setSelectedPage}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Financials</h2>
                <p>Financial management coming soon...</p>
              </div>
            </PageSection>

            <PageSection
              id={SelectedPage.Settings}
              setSelectedPage={setSelectedPage}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p>Settings configuration coming soon...</p>
              </div>
            </PageSection>

            <PageSection
              id={SelectedPage.Help}
              setSelectedPage={setSelectedPage}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Help</h2>
                <p>Help and documentation coming soon...</p>
              </div>
            </PageSection>
          </main>
        </div>
      </div>
    </ColorModeProvider>
  );
}

export default App;
