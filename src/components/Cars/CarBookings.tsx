import {
  Badge,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useCarBookings } from "@/hooks/Cars/useCarBookings";
import { useOffice } from "@/hooks/Cars/useOffice";

const CarBookings = () => {
  const { data: officeData } = useOffice();
  const {
    data: bookings,
    isLoading,
    error,
  } = useCarBookings(officeData?._id || "");
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

  //   const items = [
  //     // { label: "Newest", value: "?sort=-createdAt" },
  //     // { label: "Oldest", value: "?sort=createdAt" },
  //     { label: "No Sorting", value: "" },
  //     { label: "A-Z", value: "?sort=user" },
  //     { label: "Z-A", value: "?sort=-user" },
  //     { label: "Hotel", value: "?sort=-hotel" },
  //     { label: "Highest Price", value: "?sort=-totalPrice" },
  //     { label: "Lowest Price", value: "?sort=totalPrice" },
  //     { label: "Check In", value: "?sort=checkInDate" },
  //     { label: "Check Out", value: "?sort=checkOutDate" },
  //     { label: "Status", value: "?sort=status" },
  //   ];
  if (!bookings?.length)
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
        {/* <Search keyWord={keyWord} setKeyWord={setKeyWord} /> */}
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="8px"
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
        my={8}
      >
        <Table.ScrollArea
          borderWidth="0.5px"
          rounded="lg"
          height="fit-content"
          w="85%"
          borderRadius="2xl"
        >
          <Table.Root size="lg" stickyHeader>
            <Table.Header>
              <Table.Row
                bg="bg.subtle"
                // bgColor="#cad5e2"
                // _dark={{ bgColor: "#a0c5c2" }}
                bgColor="#4a6b9a"
                _dark={{ bgColor: "#405b81" }}
              >
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  User
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  Booked Car
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  From - To
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  Price
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  Payment
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
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
                    {booking.car.brand} {booking.car.model} {booking.car.year}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {booking.startDate.substring(0, 10)} -{" "}
                    {booking.endDate.substring(0, 10)}
                  </Table.Cell>
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
                        booking.status === "pending"
                          ? "yellow"
                          : booking.status === "confirmed"
                          ? "blue"
                          : booking.status === "cancelled"
                          ? "gray"
                          : "green"
                      }
                    >
                      {booking.status === "pending"
                        ? "Pending"
                        : booking.status === "confirmed"
                        ? "Confirmed"
                        : booking.status === "cancelled"
                        ? "Cancelled"
                        : "Completed"}
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

export default CarBookings;
