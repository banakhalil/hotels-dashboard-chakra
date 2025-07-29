import React, { useState } from "react";
import {
  Text,
  Separator,
  Card,
  Flex,
  VStack,
  HStack,
  Box,
  Button,
} from "@chakra-ui/react";
import { GiAirplaneDeparture } from "react-icons/gi";
import { FaCircle } from "react-icons/fa";
import { AllTrainsSkeleton } from "../Trains/TrainsSkeletons";
import useFlights from "@/hooks/Airlines/useFlights";
import { SelectedPage } from "@/shared/types";
import UpdateFlight from "./UpdateFlight";
import CreateFlight from "./CreateFlight";

type Props = {
  setSelectedPage: (newPage: SelectedPage) => void;
};

const skeletons = [1, 2, 3, 4];

const Flights = ({ setSelectedPage }: Props) => {
  const [isUpdateFlightOpen, setIsUpdateFlightOpen] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState("");
  const { data: flights, isLoading, error } = useFlights();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleFlightClick = (flightId: string) => {
    setSelectedFlightId(flightId);
    setIsUpdateFlightOpen(true);
  };

  const handleCloseUpdate = () => {
    setIsUpdateFlightOpen(false);
    setSelectedFlightId("");
  };

  if (isLoading)
    return skeletons.map((skeleton) => <AllTrainsSkeleton key={skeleton} />);

  if (error)
    return (
      <Flex flexDirection="column" gap={4} width="90%" margin="auto">
        <HStack justifyContent="space-between" mb={4}>
          <Box width="30%"></Box>
          <Button className="airline-button-color">Add Flight</Button>
        </HStack>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="auto"
          margin="auto"
          marginY={6}
        >
          Error loading flights
        </Text>
      </Flex>
    );

  if (!flights)
    return (
      <>
        <Flex flexDirection="column" gap={4} width="90%" margin="auto">
          <HStack justifyContent="space-between">
            <Box width="30%"></Box>
            <Button
              className="airline-button-color"
              onClick={() => {
                setIsAddOpen(true);
              }}
            >
              Add Flight
            </Button>
          </HStack>
          {isAddOpen && (
            <CreateFlight
              isOpen={isAddOpen}
              onClose={() => {
                setIsAddOpen(false);
              }}
            />
          )}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.500"
            marginTop="auto"
            margin="auto"
            marginY={6}
          >
            No Flights Found
          </Text>
        </Flex>
      </>
    );

  return (
    <Flex
      flexDirection="column"
      gap={4}
      width="90%"
      mt={2}
      mb={8}
      marginX="auto"
      maxH={{ base: "full", lg: "calc(100vh - 10px)" }}
      overflowY={{ base: "visible", lg: "auto" }}
      css={{
        "@media screen and (min-width: 62em)": {
          "&::-webkit-scrollbar": {
            width: "2px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.200",
            borderRadius: "24px",
          },
        },
      }}
    >
      <HStack
        justifyContent="space-between"
        position="sticky"
        top={0}
        zIndex={1}
        bg="rgb(230, 230, 230)"
        _dark={{
          bg: "#222222",
        }}
        transition="background-color 0.2s"
      >
        <Box width="30%"></Box>
        <Button
          className="airline-button-color"
          onClick={() => {
            setIsAddOpen(true);
          }}
        >
          Add Flight
        </Button>
      </HStack>

      {flights.map((flight) => (
        <Card.Root
          size="lg"
          key={flight._id}
          onClick={() => handleFlightClick(flight._id)}
          cursor="pointer"
          borderWidth={2}
          borderRadius="lg"
          transition="all 0.2s ease"
          _hover={{
            borderColor: "#2c2875",
            transform: "translateY(-1px)",
            shadow: "lg",
          }}
          _dark={{
            _hover: { borderColor: "#a3b3ff", borderWidth: "2px" },
          }}
        >
          <Card.Body className="card" borderRadius="lg">
            <HStack justifyContent="space-between" mx={4}>
              <VStack alignItems="start" width="200px">
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  color="#2c2875"
                  _dark={{ color: "#a3b3ff" }}
                >
                  {flight.departureAirport.name}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {flight.departureAirport.city}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {flight.departureDate.substring(0, 10)}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {flight.departureDate.substring(11, 16)}
                </Text>
              </VStack>
              <VStack alignItems="center">
                <HStack>
                  <FaCircle size={10} color="#737fe8" />
                  <Separator
                    flex="1"
                    width="350px"
                    size="md"
                    variant="dashed"
                    className="border-color"
                  />
                  <GiAirplaneDeparture size={30} color="#737fe8" />
                  <Separator
                    flex="1"
                    size="md"
                    variant="dashed"
                    className="border-color"
                  />
                  <FaCircle size={10} color="#737fe8" />
                </HStack>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {(flight.duration / 60).toString().substring(0, 1)} hrs{" "}
                  {flight.duration % 60 !== 0
                    ? (flight.duration % 60) + " mins"
                    : ""}
                </Text>
              </VStack>
              <VStack alignItems="start" width="200px">
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color="#2c2875"
                  _dark={{ color: "#a3b3ff" }}
                >
                  {flight.arrivalAirport.name}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {flight.arrivalAirport.city}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {flight.arrivalDate.substring(0, 10)}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {flight.arrivalDate.substring(11, 16)}
                </Text>
              </VStack>
            </HStack>
            <Separator
              variant="dashed"
              size="lg"
              marginY={4}
              className="border-color"
            />
            <HStack justifyContent="space-between" mx={4}>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Economy: € {flight.priceEconomy}
              </Text>
              <Text
                ml="7%"
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Gate: {flight.gateNumber}
              </Text>
              <Text
                mr="7%"
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Business: € {flight.priceBusiness}
              </Text>
            </HStack>
          </Card.Body>
        </Card.Root>
      ))}

      {isUpdateFlightOpen && (
        <UpdateFlight
          isOpen={isUpdateFlightOpen}
          onClose={handleCloseUpdate}
          flightId={selectedFlightId}
        />
      )}
      {isAddOpen && (
        <CreateFlight
          isOpen={isAddOpen}
          onClose={() => {
            setIsAddOpen(false);
          }}
        />
      )}
    </Flex>
  );
};

export default Flights;
