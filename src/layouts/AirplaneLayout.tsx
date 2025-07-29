import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SelectedPage } from "../shared/types";
import { useBreakpointValue } from "@chakra-ui/react";
import NavBar from "../components/Navbar/NavBar";
import SideBar, { SideBarItem } from "../components/SideBar";
import { LayoutDashboard } from "lucide-react";
import { BsAirplane } from "react-icons/bs";
import { MdLocalAirport } from "react-icons/md";
import { MdOutlineConnectingAirports } from "react-icons/md";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { LuCalendarCheck } from "react-icons/lu";
import { ColorModeProvider } from "../components/ui/color-mode";

interface AirplaneLayoutProps {
  selectedPage: SelectedPage;
  setSelectedPage: (page: SelectedPage) => void;
}

const AirplaneLayout = ({
  selectedPage,
  setSelectedPage,
}: AirplaneLayoutProps) => {
  const [expanded, setExpanded] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <ColorModeProvider>
      <div className="flex h-screen w-full overflow-hidden p-4">
        {/* Airplane Sidebar */}
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
              text="Airplane Dashboard"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.AirlineDashboard}
            />
            <SideBarItem
              icon={<MdOutlineConnectingAirports size={28} />}
              text="Airline"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Airlines}
            />
            <SideBarItem
              icon={<MdLocalAirport size={20} />}
              text="Airplanes"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Airplanes}
            />
            <SideBarItem
              icon={<MdOutlineAirplaneTicket size={22} />}
              text="Flights"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Flights}
            />
            <SideBarItem
              icon={<LuCalendarCheck size={20} />}
              text="Bookings"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.AirlineBookings}
            />
          </SideBar>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-4">
          <NavBar onToggleSidebar={toggleSidebar} title={selectedPage} />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <Outlet context={{ setSelectedPage }} />
          </main>
        </div>
      </div>
    </ColorModeProvider>
  );
};

export default AirplaneLayout;
