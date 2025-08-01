import {
  Badge,
  Button,
  Flex,
  HStack,
  Menu,
  Portal,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useBookings } from "@/hooks/Hotels/useBookings";
import { Search } from "../Search";
import { HiSortAscending } from "react-icons/hi";

type Props = {};

const HotelBookings = (props: Props) => {
  const [value, setValue] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const { data: bookings, isLoading, error } = useBookings(value, keyWord);
  if (isLoading)
    return (
      // <Text
      //   fontSize="xl"
      //   fontWeight="bold"
      //   color="gray.500"
      //   marginTop="auto"
      //   margin="auto"
      //   marginY={6}
      // >
      //   loading bookings
      // </Text>
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
            height="500px"
            width="100%"
            gap="4"
            bgColor="gray.300"
            _dark={{ bgColor: "gray.800" }}
          />
        }
      </HStack>
    );

  if (error)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        Error loading bookings
      </Text>
    );

  const items = [
    // { label: "Newest", value: "?sort=-createdAt" },
    // { label: "Oldest", value: "?sort=createdAt" },
    { label: "No Sorting", value: "" },
    { label: "A-Z", value: "?sort=user" },
    { label: "Z-A", value: "?sort=-user" },
    { label: "Hotel", value: "?sort=-hotel" },
    { label: "Highest Price", value: "?sort=-totalPrice" },
    { label: "Lowest Price", value: "?sort=totalPrice" },
    { label: "Check In", value: "?sort=checkInDate" },
    { label: "Status", value: "?sort=status" },
  ];
  if (!bookings?.length)
    return (
      <Flex
        justify="center"
        align="start"
        h="100%"
        direction="column"
        gap={4}
        marginX={10}
        marginY={6}
      >
        <Search keyWord={keyWord} setKeyWord={setKeyWord} />
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="auto"
          margin="auto"
        >
          No bookings found
        </Text>
        {/* <Button onClick={() => setKeyWord("")}>Clear</Button> */}
      </Flex>
    );
  return (
    <>
      <Flex
        direction="column"
        w="full"
        align="center"
        alignItems="center"
        mt={2}
        mb={8}
      >
        <HStack justifyContent="space-between" w="80%" my={6}>
          <Search keyWord={keyWord} setKeyWord={setKeyWord} />
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                width="fit-content"
                className="hotel-sort-button-color"
                // bgColor="#a2d5cb"
                // color="#0b4f4a"
                height={10}
              >
                <HiSortAscending /> Sort
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem" className="drawer">
                  <Menu.RadioItemGroup
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
                  >
                    {items.map((item) => (
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
        </HStack>

        <Table.ScrollArea
          borderWidth="0.5px"
          rounded="lg"
          height="fit-content"
          w="80%"
        >
          <Table.Root size="lg" stickyHeader>
            <Table.Header>
              <Table.Row
                bg="bg.subtle"
                // bgColor="#b2dfdb"
                // _dark={{ bgColor: "#a0c5c2" }}
                bgColor="#009688"
                _dark={{ bgColor: "#047f73" }}
              >
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  User
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Hotel
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Room
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Room Type
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Check In - Check Out
                </Table.ColumnHeader>
                {/* <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Check Out
                </Table.ColumnHeader> */}
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Price
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Payment
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#b2dfdb" width="12.5%">
                  Status
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {bookings.map((booking) => (
                <Table.Row key={booking._id} className="card ">
                  <Table.Cell textAlign="start" className="border-color">
                    <Stack>
                      <HStack>
                        {booking.user.firstName} {booking.user.lastName}
                      </HStack>
                      <Text
                        fontSize="sm"
                        color="gray.700"
                        _dark={{ color: "gray.300" }}
                      >
                        {booking.user.email}
                      </Text>
                    </Stack>
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {booking.hotel.name}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {booking.room.roomNumber}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {booking.room.roomType}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {booking.checkInDate.substring(0, 10)} -{" "}
                    {booking.checkOutDate.substring(0, 10)}
                  </Table.Cell>
                  {/* <Table.Cell textAlign="start" className="border-color">
                    {booking.checkOutDate.substring(0, 10)}
                  </Table.Cell> */}
                  <Table.Cell textAlign="start" className="border-color">
                    $ {booking.totalPrice}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    <Badge
                      size="md"
                      colorPalette={
                        booking.paymentStatus === "pending_payment"
                          ? "yellow"
                          : booking.paymentStatus === "paid"
                          ? "green"
                          : "red"
                      }
                    >
                      {booking.paymentStatus === "pending_payment"
                        ? "Pending"
                        : booking.paymentStatus === "paid"
                        ? "Paid"
                        : "Failed"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    <Badge
                      size="md"
                      colorPalette={
                        booking.status === "active"
                          ? "green"
                          : booking.status === "expired"
                          ? "blue"
                          : "gray"
                      }
                    >
                      {booking.status === "active"
                        ? "Active"
                        : booking.status === "expired"
                        ? "Expired"
                        : "Cancelled"}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Flex>
    </>
  );
};

export default HotelBookings;
