import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SelectedPage } from "../shared/types";
import { useBreakpointValue } from "@chakra-ui/react";
import NavBar from "../components/Navbar/NavBar";
import SideBar, { SideBarItem } from "../components/SideBar";
import { LayoutDashboard } from "lucide-react";
import { LuCalendarCheck } from "react-icons/lu";
import { MdOutlineBedroomParent } from "react-icons/md";
import { LiaHotelSolid } from "react-icons/lia";
import { ColorModeProvider } from "../components/ui/color-mode";

interface HotelLayoutProps {
  selectedPage: SelectedPage;
  setSelectedPage: (page: SelectedPage) => void;
}

const HotelLayout = ({ selectedPage, setSelectedPage }: HotelLayoutProps) => {
  const [expanded, setExpanded] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  //   const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

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
        {/* Hotel Sidebar */}
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
              text="Hotel Dashboard"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.HotelDashboard}
            />
            <SideBarItem
              icon={<LiaHotelSolid size={24} />}
              text="Hotels"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Hotels}
            />
            <SideBarItem
              icon={<MdOutlineBedroomParent size={22} />}
              text="Rooms"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Rooms}
            />
            <SideBarItem
              icon={<LuCalendarCheck size={20} />}
              text="Bookings"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Bookings}
            />
          </SideBar>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-4">
          <NavBar onToggleSidebar={toggleSidebar} title={selectedPage} />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <Outlet context={{ setSelectedPage }} />{" "}
            {/* This renders the nested hotel routes */}
          </main>
        </div>
      </div>
    </ColorModeProvider>
  );
};

export default HotelLayout;
