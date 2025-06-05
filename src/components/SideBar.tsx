import { Text } from "@chakra-ui/react";
import Logo from "../assets/react.svg";
import { Drawer, useBreakpointValue, Portal } from "@chakra-ui/react";

import { useContext, createContext, type ReactNode } from "react";
import { SelectedPage } from "@/shared/types";

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

const SidebarContent = ({
  children,
  expanded,
}: {
  children: ReactNode;
  expanded: boolean;
}) => {
  return (
    <>
      <br />
      <div className="py-8 flex justify-center items-center">
        <div className="px-2 flex justify-center items-center">
          <img
            src={Logo}
            className={`overflow-hidden transition-all ${
              expanded ? "w-12" : "w-8 h-8"
            }`}
            alt=""
          />
          {expanded ? (
            <Text paddingX="1" fontWeight="bold" fontSize="xl" color="blue.800">
              HotelTransylvania
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
            <Drawer.Content bgColor="blue.100">
              <Drawer.Header>
                {/* <Drawer.Title>TraveLux</Drawer.Title> */}
                {/* <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger> */}
              </Drawer.Header>
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
      <nav className="h-full flex flex-col bg-blue-100 border-r shadow-sm rounded-xl">
        <SidebarContent expanded={expanded}>{children}</SidebarContent>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  // alert?: boolean;
  // page: string;
  selectedPage: SelectedPage;
  setSelectedPage: (newpage: SelectedPage) => void;
}

export function SideBarItem({
  icon,
  text,
  active,
  selectedPage,
  setSelectedPage,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  const lowerCasePage = text.toLowerCase().replace(/ /g, "") as SelectedPage;

  const handleClick = () => {
    setSelectedPage(lowerCasePage);
    const element = document.getElementById(lowerCasePage);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <li
      onClick={handleClick}
      className={`
        relative flex items-center justify-around my-0.5 
        font-medium rounded-md cursor-pointer
        transition-all duration-300 ease-in-out
        ${expanded ? "h-12 py-2 mx-10" : "h-9 w-9 p-1.5 justify-center"}
        ${
          selectedPage === lowerCasePage
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      <div
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
