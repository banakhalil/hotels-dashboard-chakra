import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SelectedPage } from "../shared/types";
import { useBreakpointValue } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import SideBar, { SideBarItem } from "../components/SideBar";
import { LayoutDashboard, Settings } from "lucide-react";
import { GiRailRoad } from "react-icons/gi";
import { FaRoute } from "react-icons/fa";
import { MdTrain } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi2";
import { ColorModeProvider } from "../components/ui/color-mode";

interface TrainLayoutProps {
  selectedPage: SelectedPage;
  setSelectedPage: (page: SelectedPage) => void;
}
const TrainLayout = ({ selectedPage, setSelectedPage }: TrainLayoutProps) => {
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
        {/* Train Sidebar */}
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
              icon={<GiRailRoad size={20} />}
              text="Stations"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<MdTrain size={20} />}
              text="Trains"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<FaRoute size={20} />}
              text="Routes"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <SideBarItem
              icon={<HiOutlineTicket size={25} />}
              text="traintrips"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </SideBar>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-4">
          <NavBar onToggleSidebar={toggleSidebar} title={selectedPage} />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <Outlet context={{ setSelectedPage }} />{" "}
            {/* This renders the nested train routes */}
          </main>
        </div>
      </div>
    </ColorModeProvider>
  );
};

export default TrainLayout;
