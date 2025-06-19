import {
  Button,
  createListCollection,
  HStack,
  Image,
  Menu,
  Portal,
  Select,
  Spinner,
  Stack,
  Text,
  useBreakpoint,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Logo from "../assets/react.svg";
import { ColorModeButton, ColorModeIcon } from "./ui/color-mode";
import { Search } from "./Search";
import AvatarNav from "./AvatarNav";
import { IoMdNotificationsOutline } from "react-icons/io";
import useMediaQuery from "@/hooks/useMediaQuery";
import { GoSidebarCollapse } from "react-icons/go";
import Profile from "./Profile";
import { useProfile } from "@/hooks/useProfile";
import Password from "./Password";
import type { MenuSelectionDetails } from "@chakra-ui/react";
import Logout from "./Logout";
import SessionTimer from "./SessionTimer";

interface NavBarProps {
  onToggleSidebar: () => void;
  title: string;
}

const NavBar = ({ onToggleSidebar, title }: NavBarProps) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const { data: user, isLoading } = useProfile();
  // const profileCollection = createListCollection({
  //   items: [
  //     { label: "View Profile", value: "profile" },
  //     { label: "Change Password", value: "password" },
  //   ],
  // });
  const [selectedProfile, setSelectedProfile] = useState<string | undefined>(
    undefined
  );
  const handleProfileSelect = (details: MenuSelectionDetails) => {
    setSelectedProfile(details.value);
    setIsOpen(true);
  };
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
              {title}
            </Text>
          </HStack>
          <HStack gap={4}>
            {/* <Search></Search> */}
            <SessionTimer />
            <Button variant="ghost" size="lg" padding="0" margin="0">
              <IoMdNotificationsOutline />
            </Button>
            <ColorModeButton />

            <Menu.Root onSelect={handleProfileSelect}>
              <Menu.Trigger asChild>
                <Button variant="ghost">
                  {isLoading || !user ? (
                    <Spinner />
                  ) : (
                    <AvatarNav
                      name={`${user.firstName} ${user.lastName}`}
                      image={typeof user.avatar === "string" ? user.avatar : ""}
                    />
                  )}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content className="drawer">
                    <Menu.Item value="profile" fontWeight="medium">
                      View Profile
                    </Menu.Item>
                    <Menu.Item value="password" fontWeight="medium">
                      Change Password
                    </Menu.Item>
                    <Menu.Item value="logout" color="red" fontWeight="medium">
                      Log Out
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            {/* <Select.Root
              collection={profileCollection}
              size="sm"
              width="320px"
              value={selectedProfile ? [selectedProfile] : []}
              onValueChange={(v) => {
                // Take the first item if it's an array, or use the value directly
                const value = Array.isArray(v.value) ? v.value[0] : v.value;
                console.log(value);
                setSelectedProfile(value);
              }}
            >
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select a hotel to view rooms" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {profileCollection.items.map((profile) => (
                      <Select.Item item={profile} key={profile.value}>
                        {profile.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root> */}
            {user && selectedProfile === "profile" && (
              <Profile
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false);
                  setSelectedProfile(undefined);
                }}
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                role={user.role}
                avatar={typeof user.avatar === "string" ? user.avatar : ""}
              />
            )}
            {user && selectedProfile === "password" && (
              <Password
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false);
                  setSelectedProfile(undefined);
                }}
              />
            )}
            {user && selectedProfile === "logout" && (
              <Logout
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false);
                  setSelectedProfile(undefined);
                }}
              />
            )}
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
              {/* <Search></Search> */}
            </HStack>

            <HStack gap={4}>
              <SessionTimer />
              <Button variant="ghost" size="lg" padding="0" margin="0">
                <IoMdNotificationsOutline />
              </Button>
              <ColorModeButton />
              <Menu.Root onSelect={handleProfileSelect}>
                <Menu.Trigger asChild>
                  <Button variant="ghost">
                    {isLoading || !user ? (
                      <Spinner />
                    ) : (
                      <AvatarNav
                        name={`${user.firstName} ${user.lastName}`}
                        image={
                          typeof user.avatar === "string" ? user.avatar : ""
                        }
                      />
                    )}
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content className="drawer">
                      <Menu.Item value="profile" fontWeight="medium">
                        View Profile
                      </Menu.Item>
                      <Menu.Item value="password" fontWeight="medium">
                        Change Password
                      </Menu.Item>
                      <Menu.Item value="logout" color="red" fontWeight="medium">
                        Log Out
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              {user && selectedProfile === "profile" && (
                <Profile
                  isOpen={isOpen}
                  onClose={() => {
                    setIsOpen(false);
                    setSelectedProfile(undefined);
                  }}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  email={user.email}
                  role={user.role}
                  avatar={typeof user.avatar === "string" ? user.avatar : ""}
                />
              )}
              {user && selectedProfile === "password" && (
                <Password
                  isOpen={isOpen}
                  onClose={() => {
                    setIsOpen(false);
                    setSelectedProfile(undefined);
                  }}
                />
              )}
              {user && selectedProfile === "logout" && (
                <Logout
                  isOpen={isOpen}
                  onClose={() => {
                    setIsOpen(false);
                    setSelectedProfile(undefined);
                  }}
                />
              )}
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
