import {
  Button,
  HStack,
  Image,
  Stack,
  Text,
  useBreakpoint,
} from "@chakra-ui/react";
import React from "react";
import Logo from "../assets/react.svg";
import { ColorModeButton, ColorModeIcon } from "./ui/color-mode";
import { Search } from "./Search";
import AvatarNav from "./AvatarNav";
import { IoMdNotificationsOutline } from "react-icons/io";
import useMediaQuery from "@/hooks/useMediaQuery";
import { GoSidebarCollapse } from "react-icons/go";

interface NavBarProps {
  onToggleSidebar: () => void;
}

const NavBar = ({ onToggleSidebar }: NavBarProps) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isAboveMediumScreens ? (
        <HStack padding="20px" justifyContent="space-between">
          <HStack>
            <Button
              variant="ghost"
              size="lg"
              padding="0"
              margin="0"
              onClick={onToggleSidebar}
            >
              <GoSidebarCollapse />
            </Button>
            <Text hideBelow="md" fontWeight="bold" fontSize="xl">
              PageName
            </Text>
          </HStack>
          <HStack>
            <Search></Search>
            <Button variant="ghost" size="lg" padding="0" margin="0">
              <IoMdNotificationsOutline />
            </Button>
            <ColorModeButton />
            <AvatarNav />
          </HStack>
        </HStack>
      ) : (
        <Stack padding="20px">
          <HStack justifyContent="space-between">
            <HStack>
              <Button
                variant="ghost"
                size="lg"
                padding="0"
                margin="0"
                onClick={onToggleSidebar}
              >
                <GoSidebarCollapse />
              </Button>
              <Search></Search>
            </HStack>

            <HStack>
              <Button variant="ghost" size="lg" padding="0" margin="0">
                <IoMdNotificationsOutline />
              </Button>
              <ColorModeButton />
              <AvatarNav />
            </HStack>
          </HStack>
          <Text paddingTop="10px" fontWeight="bold" fontSize="xl">
            PageName
          </Text>
        </Stack>
      )}
    </>
  );
};

export default NavBar;
