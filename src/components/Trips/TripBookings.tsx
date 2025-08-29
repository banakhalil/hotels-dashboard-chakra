import { Flex, HStack, Skeleton, Stack, Table, Text } from "@chakra-ui/react";
// import type { SelectedPage } from "@/shared/types";
import { useTripBookings } from "@/hooks/Trips/useTripBookings";
import { MdOutlineTrain } from "react-icons/md";
import { MdLocalAirport } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
// type Props = {
//   setSelectedPage: (newPage: SelectedPage) => void;
// };

const TripBookings = () => {
  const { data: bookings, isLoading, error } = useTripBookings();
  console.log(bookings);
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
  if (!bookings?.length || error)
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
          No bookings found
        </Text>
      </Flex>
    );

  // if (error)
  //   return (
  //     <Text
  //       fontSize="xl"
  //       fontWeight="bold"
  //       color="gray.500"
  //       marginTop="auto"
  //       margin="auto"
  //       marginY={6}
  //       textAlign="center"
  //     >
  //       Error loading bookings
  //     </Text>
  //   );

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
                className="font-oswald"
                letterSpacing="wide"
                fontSize="lg"
                bg="bg.subtle"
                bgColor="#164b9a"
                _dark={{ bgColor: "#164b9a" }}
              >
                <Table.ColumnHeader color="#bedbff" width="12.5%">
                  User
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#bedbff" width="12.5%">
                  Trip
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#bedbff" width="12.5%">
                  Hotel
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#bedbff" width="12.5%">
                  Transport
                </Table.ColumnHeader>
                {/* <Table.ColumnHeader
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
                </Table.ColumnHeader> */}
              </Table.Row>
            </Table.Header>

            <Table.Body
              className="font-oswald"
              letterSpacing="wide"
              fontSize="lg"
            >
              {bookings
                .filter(
                  (booking) =>
                    booking.bookings.trips.length > 0 ||
                    booking.bookings.hotel.length > 0 ||
                    booking.bookings.transport.length > 0
                )
                .map((booking) => (
                  <Table.Row key={booking._id} className="card ">
                    <Table.Cell
                      textAlign="start"
                      className="border-color"
                      fontSize="md"
                      fontWeight="normal"
                    >
                      <Stack>
                        <HStack>
                          {booking.firstName} {booking.lastName}
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
                      {/* <Stack>
                      <HStack>
                        {booking.outboundFlight.departureAirport.city}{" "}
                        {booking.outboundFlight.departureAirport.iata}
                        {" - "}
                        {booking.outboundFlight.arrivalAirport.city}{" "}
                        {booking.outboundFlight.arrivalAirport.iata}
                      </HStack>
                      {booking.outboundFlight.departureDate.substring(0, 10)}
                    </Stack> */}
                      <Stack gap={2}>
                        {Array.from(
                          new Set(
                            booking.bookings.trips.map((t) => t.trip.title)
                          )
                        ).length > 0 ? (
                          Array.from(
                            new Set(
                              booking.bookings.trips.map((t) => t.trip.title)
                            )
                          ).map((title, index) => (
                            <Text key={index} fontSize="md" fontWeight="normal">
                              {title}
                            </Text>
                          ))
                        ) : (
                          <Text fontSize="md" fontWeight="normal">
                            ---
                          </Text>
                        )}
                      </Stack>
                    </Table.Cell>
                    <Table.Cell textAlign="start" className="border-color">
                      {/* <Stack>
                      <HStack>
                        {booking.returnFlight.departureAirport.city}{" "}
                        {booking.returnFlight.departureAirport.iata} {" - "}
                        {booking.returnFlight.arrivalAirport.city}{" "}
                        {booking.returnFlight.arrivalAirport.iata}
                      </HStack>
                      {booking.returnFlight.departureDate.substring(0, 10)}
                    </Stack> */}
                      <Stack gap={2}>
                        {Array.from(
                          new Set(
                            booking.bookings.hotel.map((h) => h.hotel.name)
                          )
                        ).length > 0 ? (
                          Array.from(
                            new Set(
                              booking.bookings.hotel.map((h) => h.hotel.name)
                            )
                          ).map((hotelName, index) => (
                            <Text key={index} fontSize="md" fontWeight="normal">
                              {hotelName}
                            </Text>
                          ))
                        ) : (
                          <Text fontSize="md" fontWeight="normal">
                            ---
                          </Text>
                        )}
                      </Stack>
                    </Table.Cell>
                    <Table.Cell textAlign="start" className="border-color">
                      <Stack gap={2}>
                        {Array.from(
                          new Set(
                            booking.bookings.transport
                              .map((s: any) => {
                                if (s.trainTrip)
                                  return (
                                    <HStack>
                                      <MdOutlineTrain />
                                      {s.trainTrip.route.name}
                                    </HStack>
                                  );
                                if (s.car && s.car.brand && s.car.model)
                                  return (
                                    <HStack>
                                      <IoCarSport />
                                      {s.car.brand} {s.car.model}
                                    </HStack>
                                  );

                                if (s.outboundFlight && s.returnFlight)
                                  return (
                                    <HStack>
                                      <MdLocalAirport />
                                      {
                                        s.outboundFlight.departureAirport.city
                                      } - {s.returnFlight.departureAirport.city}
                                    </HStack>
                                  );

                                return "";
                              })
                              .filter(Boolean)
                          )
                        ).length > 0 ? (
                          Array.from(
                            new Set(
                              booking.bookings.transport
                                .map((s: any) => {
                                  if (s.trainTrip)
                                    return (
                                      <HStack>
                                        <MdOutlineTrain />
                                        {s.trainTrip.route.name}
                                      </HStack>
                                    );
                                  if (s.car && s.car.brand && s.car.model)
                                    return (
                                      <HStack>
                                        <IoCarSport />
                                        {s.car.brand} {s.car.model}
                                      </HStack>
                                    );
                                  if (s.outboundFlight && s.returnFlight)
                                    return (
                                      <HStack>
                                        <MdLocalAirport />
                                        {
                                          s.outboundFlight.departureAirport.city
                                        }{" "}
                                        - {s.returnFlight.departureAirport.city}
                                      </HStack>
                                    );
                                  return "";
                                })
                                .filter(Boolean)
                            )
                          ).map((transport, index) => (
                            <Text key={index} fontSize="md" fontWeight="normal">
                              {transport}
                            </Text>
                          ))
                        ) : (
                          <Text fontSize="md" fontWeight="normal">
                            ---
                          </Text>
                        )}
                      </Stack>
                    </Table.Cell>
                    {/* <Table.Cell textAlign="start" className="border-color">
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
                  </Table.Cell> */}

                    {/* <Table.Cell textAlign="start" className="border-color">
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
                  </Table.Cell> */}
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Flex>
    </>
  );
};

export default TripBookings;
