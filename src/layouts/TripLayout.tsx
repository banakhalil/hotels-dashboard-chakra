import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SelectedPage } from "../shared/types";
import { useBreakpointValue } from "@chakra-ui/react";
import NavBar from "../components/Navbar/NavBar";
import SideBar, { SideBarItem } from "../components/SideBar";
import { LayoutDashboard } from "lucide-react";
import { LuCalendarCheck } from "react-icons/lu";
import { LiaHotelSolid } from "react-icons/lia";
import { FaBusAlt } from "react-icons/fa";
import { BsCalendar2Event } from "react-icons/bs";
import { GrMultiple } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { ColorModeProvider } from "../components/ui/color-mode";

interface AirplaneLayoutProps {
  selectedPage: SelectedPage;
  setSelectedPage: (page: SelectedPage) => void;
}

const TripLayout = ({ selectedPage, setSelectedPage }: AirplaneLayoutProps) => {
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
        {/* Trip Sidebar */}
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
              icon={<LayoutDashboard size={22} />}
              text="Dashboard"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.AdminDashboard}
            />
            <SideBarItem
              icon={<BsCalendar2Event size={22} />}
              text="Events"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Events}
            />
            <SideBarItem
              icon={<GrMultiple size={22} />}
              text="Packages"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Packages}
            />
            <SideBarItem
              icon={<LiaHotelSolid size={26} />}
              text="Stays"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Stays}
            />
            <SideBarItem
              icon={<FaBusAlt size={20} />}
              text="Transport"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Transport}
            />
            <SideBarItem
              icon={<FaUserEdit size={20} />}
              text="Manage Users"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.ManageUsers}
            />
            <SideBarItem
              icon={<LuCalendarCheck size={20} />}
              text="Bookings"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.UserBookings}
            />
            <SideBarItem
              icon={<FaUsers size={20} />}
              text="Users"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              page={SelectedPage.Users}
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

export default TripLayout;
