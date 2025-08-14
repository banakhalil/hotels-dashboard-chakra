import {
  Badge,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import type { SelectedPage } from "@/shared/types";
import { useFlightBookings } from "@/hooks/Airlines/useAirlineBookings";

type Props = {
  setSelectedPage: (newPage: SelectedPage) => void;
};

const CarBookings = ({ setSelectedPage }: Props) => {
  const { data: bookings, isLoading, error } = useFlightBookings();

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
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="8px"
          margin="auto"
        >
          No bookings found
        </Text>
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
          w="80%"
          borderRadius="2xl"
        >
          <Table.Root size="lg" stickyHeader>
            <Table.Header>
              <Table.Row
                bg="bg.subtle"
                bgColor="#2c2875"
                _dark={{ bgColor: "#b6c2ff" }}
              >
                <Table.ColumnHeader
                  color="#b6c2ff"
                  _dark={{ color: "#25225f" }}
                  width="12.5%"
                >
                  User
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="#b6c2ff"
                  _dark={{ color: "#25225f" }}
                  width="12.5%"
                >
                  From - To
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="#b6c2ff"
                  _dark={{ color: "#25225f" }}
                  width="12.5%"
                >
                  Return Flight
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="#b6c2ff"
                  _dark={{ color: "#25225f" }}
                  width="12.5%"
                >
                  Booked Seats
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="#b6c2ff"
                  _dark={{ color: "#25225f" }}
                  width="12.5%"
                >
                  Price
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="#b6c2ff"
                  _dark={{ color: "#25225f" }}
                  width="12.5%"
                >
                  Payment
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="#b6c2ff"
                  _dark={{ color: "#25225f" }}
                  width="12.5%"
                >
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
                      {/* <Text
                        fontSize="sm"
                        color="gray.700"
                        _dark={{ color: "gray.300" }}
                      >
                        {booking.user.email}
                      </Text> */}
                    </Stack>
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    <Stack>
                      <HStack>
                        {booking.outboundFlight.departureAirport.city}{" "}
                        {booking.outboundFlight.departureAirport.iata}
                        {" - "}
                        {booking.outboundFlight.arrivalAirport.city}{" "}
                        {booking.outboundFlight.arrivalAirport.iata}
                      </HStack>
                      {booking.outboundFlight.departureDate.substring(0, 10)}
                    </Stack>
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    <Stack>
                      <HStack>
                        {booking.returnFlight.departureAirport.city}{" "}
                        {booking.returnFlight.departureAirport.iata} {" - "}
                        {booking.returnFlight.arrivalAirport.city}{" "}
                        {booking.returnFlight.arrivalAirport.iata}
                      </HStack>
                      {booking.returnFlight.departureDate.substring(0, 10)}
                    </Stack>
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {booking.bookedSeats
                      .map((seat) => seat.seatNumber)
                      .join(" - ")}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    $ {booking.finalPrice}
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

export default CarBookings;
