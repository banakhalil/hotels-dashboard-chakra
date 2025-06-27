import { Text } from "@chakra-ui/react";
// import Logo from "@/assets/train-track.svg";
import { Drawer, useBreakpointValue, Portal } from "@chakra-ui/react";
import { useContext, createContext, type ReactNode } from "react";
import { SelectedPage } from "@/shared/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LuTrainTrack } from "react-icons/lu";
import { BsFillBuildingsFill } from "react-icons/bs";

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

interface SidebarProps {
  children: ReactNode;
  expanded: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const getRoleBasedClasses = (role: string | undefined) => {
  switch (role) {
    case "hotelManager":
      return {
        sidebarColor: "hotel-sidebar-color",
        selectedItem: "hotel-selected-items",
        notSelectedItem: "hotel-not-selected-items",
      };
    case "routeManager":
      return {
        sidebarColor: "route-sidebar-color",
        selectedItem: "route-selected-items",
        notSelectedItem: "route-not-selected-items",
      };
    case "airlineOwner":
      return {
        sidebarColor: "airline-sidebar-color",
        selectedItem: "airline-selected-items",
        notSelectedItem: "airline-not-selected-items",
      };
    default:
      return {
        sidebarColor: "sidebar-color",
        selectedItem: "sidebar-selected-items",
        notSelectedItem: "sidebar-not-selected-items",
      };
  }
};

const getRoleBasedTitle = (role: string | undefined) => {
  switch (role) {
    case "hotelManager":
      return "Saint Motel";
    case "routeManager":
      return "Rail Ninja";
    case "airlineOwner":
      return "AirlineTransylvania";
    default:
      return "Transylvania";
  }
};
const getRoleBasedLodo = (role: string | undefined) => {
  switch (role) {
    case "hotelManager":
      return <BsFillBuildingsFill size={38} color="#a0c5c2" />;
    case "routeManager":
      return <LuTrainTrack size={38} color="#ffccbc" />;
    case "airlineOwner":
      return "AirlineTransylvania";
    default:
      return "Transylvania";
  }
};

const SidebarContent = ({
  children,
  expanded,
}: {
  children: ReactNode;
  expanded: boolean;
}) => {
  const { user } = useAuth();
  const themeClasses = getRoleBasedClasses(user?.role);
  const title = getRoleBasedTitle(user?.role);
  const logo = getRoleBasedLodo(user?.role);
  return (
    <>
      <br />
      <div className="py-8 flex justify-center items-center">
        <div className="px-2 flex justify-center items-center">
          {/* <img
            src={Logo}
            className={`overflow-hidden transition-all ${
              expanded ? "w-12" : "w-8 h-8"
            }`}
            alt=""
          /> */}
          {logo}
          {expanded ? (
            <Text
              paddingX="1"
              ml={1}
              fontWeight="bold"
              fontSize="xl"
              color="rgb(245, 244, 244)"
            >
              {title}
            </Text>
          ) : null}
        </div>
      </div>
      <br />

      <SidebarContext.Provider value={{ expanded }}>
        <ul
          className={`flex-1 px-4 flex flex-col ${
            !expanded && "items-center gap-4"
          } mt-6`}
        >
          {children}
        </ul>
      </SidebarContext.Provider>
    </>
  );
};

export default function SideBar({
  children,
  expanded,
  isOpen,
  onClose,
}: SidebarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { user } = useAuth();
  const themeClasses = getRoleBasedClasses(user?.role);

  if (isMobile) {
    return (
      <Drawer.Root
        placement="start"
        open={isOpen}
        onOpenChange={() => onClose()}
      >
        <Portal>
          <Drawer.Backdrop backdropBlur="10" />
          <Drawer.Positioner>
            <Drawer.Content className={themeClasses.sidebarColor}>
              <Drawer.Header></Drawer.Header>
              <Drawer.Body>
                <SidebarContent expanded={true}>{children}</SidebarContent>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
  }

  return (
    <aside className="h-full">
      <nav
        className={`h-full flex flex-col ${themeClasses.sidebarColor} border-r shadow-sm rounded-sm`}
      >
        <SidebarContent expanded={expanded}>{children}</SidebarContent>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (newpage: SelectedPage) => void;
  page: SelectedPage;
}

export function SideBarItem({
  icon,
  text,
  active,
  selectedPage,
  setSelectedPage,
  page,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const themeClasses = getRoleBasedClasses(user?.role);

  const handleClick = () => {
    setSelectedPage(page);
  };

  return (
    <li
      title={text}
      onClick={handleClick}
      style={{ fontWeight: "bold" }}
      className={`
        relative flex items-center justify-around my-0.5 
        font-medium rounded-md cursor-pointer
        transition-all duration-300 ease-in-out sidebar-text-color
        ${expanded ? "h-12 py-2 mx-10" : "h-9 w-9 p-1.5 justify-center"}
        ${
          selectedPage === page
            ? themeClasses.selectedItem
            : themeClasses.notSelectedItem
        }
    `}
    >
      <div
        title={text}
        className={`flex items-center justify-center ${
          expanded ? "ml-4 " : "w-full h-full"
        }`}
      >
        {icon}
      </div>
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3 p-4" : "w-0"
        }`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3
            transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            whitespace-nowrap z-50
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
