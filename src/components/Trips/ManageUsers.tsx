"use client";

import {
  useGetChangeableUsers,
  useCreateGuide,
  useUpdateUserRole,
} from "@/hooks/Trips/usemanageUsers";
import {
  ActionBar,
  Button,
  Box,
  Flex,
  Portal,
  Table,
  Menu,
  HStack,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { toaster } from "../ui/toaster";
import { AxiosError } from "axios";
import { useTranslation } from "@/contexts/TranslationContext";

const ManageUsers = () => {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const { data: users, isLoading, error } = useGetChangeableUsers();
  const createGuideMutation = useCreateGuide();
  const updateUserRoleMutation = useUpdateUserRole(selectedUser || "");
  //   console.log(selectedUser);
  const hasSelection = selectedUser !== null;

  const roles = [
    // { label: "Newest", value: "?sort=-createdAt" },
    // { label: "Oldest", value: "?sort=createdAt" },
    { label: "Hotel Manager", value: "hotelManager" },
    { label: "Office Manager", value: "officeManager" },
    { label: "Route Manager", value: "routeManager" },
    { label: "Airline Owner", value: "airlineOwner" },
  ];

  if (isLoading)
    return (
      <HStack
        gap={4}
        justifyContent="center"
        alignItems="center"
        my={20}
        mx="100px"
      >
        {
          // skeletons.map((skeleton) => (
          //   <BookingsSkeleton key={skeleton} />
          // ))
          <Skeleton
            variant="pulse"
            // noOfLines={6}
            borderRadius="2xl"
            height="500px"
            width="100%"
            gap="4"
            bgColor="gray.300"
            _dark={{ bgColor: "gray.800" }}
          />
        }
      </HStack>
    );

  if (!users?.length)
    return (
      <Flex
        justify="center"
        align="start"
        h="100%"
        direction="column"
        gap={4}
        marginX={10}
        marginY={10}
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="8px"
          margin="auto"
          textAlign="center"
        >
          No users to manage
        </Text>
      </Flex>
    );
  if (error)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        marginX="auto"
        marginY={6}
        textAlign="center"
      >
        Error loading users
      </Text>
    );
  const rows = users?.map((item) => (
    <Table.Row
      className="card font-oswald"
      fontWeight="normal"
      // className="card"
      key={item._id}
      data-selected={selectedUser === item._id ? "" : undefined}
    >
      <Table.Cell className="border-color">
        <Box as="label">
          <input
            type="radio"
            {...{
              name: "user-select",
              value: item._id,
              checked: selectedUser === item._id,
              onChange: (e: ChangeEvent<HTMLInputElement>) =>
                setSelectedUser(e.target.value),
              style: { cursor: "pointer" },
            }}
          />
        </Box>
      </Table.Cell>
      <Table.Cell className="border-color">
        {item.firstName + " " + item.lastName}
      </Table.Cell>
      <Table.Cell className="border-color">{item.email}</Table.Cell>
      <Table.Cell className="border-color">{item.role}</Table.Cell>
    </Table.Row>
  ));

  return (
    <>
      <Flex
        direction="column"
        w="full"
        align="center"
        alignItems="center"
        my={8}
        height="fit-content"
      >
        {/* <Box borderRadius="2xl" overflow="hidden" w="85%"> */}
        <Table.ScrollArea
          borderWidth="0.5px"
          rounded="lg"
          height="fit-content"
          w="85%"
          borderRadius="2xl"
        >
          <Table.Root size="lg" stickyHeader w="full">
            <Table.Header>
              <Table.Row
                className=" font-oswald"
                bg="bg.subtle"
                fontSize="lg"
                bgColor="#164b9a"
                _dark={{ bgColor: "#164b9a" }}
              >
                <Table.ColumnHeader w="6" color="#bedbff">
                  Select
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#bedbff">Name</Table.ColumnHeader>
                <Table.ColumnHeader color="#bedbff">Email</Table.ColumnHeader>
                <Table.ColumnHeader color="#bedbff">Role</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body className="card border-color">{rows}</Table.Body>
          </Table.Root>
        </Table.ScrollArea>
        {/* </Box> */}

        <ActionBar.Root open={hasSelection}>
          <Portal>
            <ActionBar.Positioner position="absolute" bottom={4} left="12%">
              <ActionBar.Content className="drawer">
                <ActionBar.SelectionTrigger className="border-color">
                  {users?.find((u) => u._id === selectedUser)?.firstName ||
                    "User"}{" "}
                  selected
                </ActionBar.SelectionTrigger>
                <ActionBar.Separator bg="#aca8a8" _dark={{ bg: "#525151" }} />
                <Button
                  variant="subtle"
                  className="trip-secondary-button-color"
                  size="sm"
                  onClick={() => {
                    if (selectedUser) {
                      createGuideMutation.mutate(
                        { data: { user: selectedUser } },
                        {
                          onSuccess: () => {
                            setSelectedUser(null);
                            toaster.create({
                              title: "Success",
                              description:
                                "User has been made a guide successfully",
                              type: "success",
                              duration: 3000,
                              closable: true,
                            });
                          },
                          onError: (error) => {
                            toaster.create({
                              title: "Error",
                              description:
                                error instanceof AxiosError
                                  ? Array.isArray(error.response?.data.errors)
                                    ? error.response.data.errors
                                        .map((err: any) => err.msg)
                                        .join(`  ////  `)
                                    : error.response?.data.errors?.msg ||
                                      error.response?.data.message ||
                                      "Failed to make user a guide. Please try again."
                                  : "Failed to make user a guide. Please try again.",
                              type: "error",
                              duration: 5000,
                              closable: true,
                            });
                          },
                        }
                      );
                    }
                  }}
                  loading={createGuideMutation.isPending}
                >
                  {t("buttons.makeGuide")}
                </Button>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="solid"
                      size="sm"
                      width="fit-content"
                      className="trip-button-color"
                      // bgColor="#a2d5cb"
                      // color="#0b4f4a"
                      // height={10}
                    >
                      {t("buttons.makeManager")}
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner className="drawer">
                      <Menu.Content minW="10rem" className="drawer">
                        <Menu.RadioItemGroup
                          value={role}
                          onValueChange={(e) => {
                            setRole(e.value);
                            if (e.value) {
                              updateUserRoleMutation.mutate(e.value, {
                                onSuccess: () => {
                                  setSelectedUser(null);
                                  setRole("");
                                  toaster.create({
                                    title: "Success",
                                    description:
                                      "User role has been updated successfully",
                                    type: "success",
                                    duration: 3000,
                                    closable: true,
                                  });
                                },
                                onError: (error) => {
                                  toaster.create({
                                    title: "Error",
                                    description:
                                      error instanceof AxiosError
                                        ? Array.isArray(
                                            error.response?.data.errors
                                          )
                                          ? error.response.data.errors
                                              .map((err: any) => err.msg)
                                              .join(`  ////  `)
                                          : error.response?.data.errors?.msg ||
                                            error.response?.data.message ||
                                            "Failed to update user role. Please try again."
                                        : "Failed to update user role. Please try again.",
                                    type: "error",
                                    duration: 5000,
                                    closable: true,
                                  });
                                },
                              });
                            }
                          }}
                        >
                          {roles.map((item) => (
                            <Menu.RadioItem key={item.value} value={item.value}>
                              {item.label}
                              <Menu.ItemIndicator />
                            </Menu.RadioItem>
                          ))}
                        </Menu.RadioItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <ActionBar.Separator bg="#aca8a8" _dark={{ bg: "#525151" }} />
                <Button
                  variant="subtle"
                  colorPalette="gray"
                  onClick={() => {
                    setSelectedUser(null);
                  }}
                >
                  X
                </Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>
      </Flex>
    </>
  );
};

export default ManageUsers;
