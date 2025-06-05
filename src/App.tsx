import { Grid, GridItem } from "@chakra-ui/react";
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

function App() {
  const [expanded, setExpanded] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Dashboard
  );

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
              active
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<BarChart3 size={20} />}
              text="Statistics"
              setSelectedPage={setSelectedPage}
            />
            {/* <SideBarItem
              icon={<UserCircle size={20} />}
              text="Users"
              setSelectedPage={setSelectedPage}
            /> */}
            <SideBarItem
              icon={<LuCalendarCheck size={20} />}
              text="Bookings"
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<MdOutlineBedroomParent size={20} />}
              text="Rooms"
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<IoCalendarNumberOutline size={20} />}
              text="Calendar"
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<PiMoneyDuotone size={20} />}
              text="Finacials"
              setSelectedPage={setSelectedPage}
            />
            {/* <hr className="my-3" /> */}
            <SideBarItem
              icon={<Settings size={20} />}
              text="Settings"
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<MdOutlineHelpCenter size={20} />}
              text="Help"
              setSelectedPage={setSelectedPage}
            />
          </SideBar>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-4">
          <NavBar onToggleSidebar={toggleSidebar} />
          <main className="flex-1 p-6 overflow-auto">
            {/* <Dashboard /> */}
            {/* <Hotels  /> */}
            <CardHotels onClick={() => console.log("clicked")} />
          </main>
        </div>
      </div>
    </ColorModeProvider>
  );
}

export default App;
