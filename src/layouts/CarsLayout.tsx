import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SelectedPage } from "../shared/types";
import { useBreakpointValue } from "@chakra-ui/react";
import NavBar from "../components/Navbar/NavBar";
import SideBar, { SideBarItem } from "../components/SideBar";
import { LayoutDashboard } from "lucide-react";
import { IoCarSport } from "react-icons/io5";
import { TicketCheck } from "lucide-react";
import { GrLicense } from "react-icons/gr";
import { ColorModeProvider } from "../components/ui/color-mode";

interface CarsLayoutProps {
  selectedPage: SelectedPage;
  setSelectedPage: (page: SelectedPage) => void;
}

const CarsLayout = ({ selectedPage, setSelectedPage }: CarsLayoutProps) => {
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
        {/* Cars Sidebar */}
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
              text="Cars Dashboard"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.CarsDashboard}
            />
            <SideBarItem
              icon={<GrLicense size={22} />}
              text="Car Office"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Office}
            />
            <SideBarItem
              icon={<IoCarSport size={24} />}
              text="Cars"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Cars}
            />
            <SideBarItem
              icon={<TicketCheck size={24} />}
              text="Bookings"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.CarBookings}
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

export default CarsLayout;
