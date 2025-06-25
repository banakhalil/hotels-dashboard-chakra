import useTrainTrips from "@/hooks/useTrainTrips";
import React, { useState } from "react";
import {
  Text,
  Separator,
  Card,
  Heading,
  Flex,
  VStack,
  HStack,
  Box,
  Button,
} from "@chakra-ui/react";
import { MdOutlineTrain } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { NotImmediateSearch } from "../Search";
import AddTrainTrip from "./AddTrainTrip";
import UpdateTrainTrip from "./UpdateTrainTrip";

type Props = {};

const TrainTrips = (props: Props) => {
  const [keyWord, setKeyWord] = useState("");
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isUpdateTripOpen, setIsUpdateTripOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("");
  const { data: traintrips, isLoading, error } = useTrainTrips(keyWord);
  console.log(traintrips);
  if (isLoading)
    return (
      <Flex flexDirection="column" gap={4} width="90%" margin="auto">
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="auto"
          margin="auto"
          marginY={6}
        >
          loading...
        </Text>
      </Flex>
    );

  if (error && !keyWord)
    return (
      <Flex flexDirection="column" gap={4} width="90%" margin="auto">
        <HStack justifyContent="space-between" mb={4}>
          <Box width="30%">
            {/* <NotImmediateSearch
              placeholder="berlin,munich"
              keyWord={keyWord}
              setKeyWord={setKeyWord}
            /> */}
          </Box>
          <Button
            className="train-secondary-button-color"
            onClick={() => setIsAddTripOpen(true)}
          >
            Add Trip
          </Button>
        </HStack>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="auto"
          margin="auto"
          marginY={6}
        >
          please enter two cities to search for trips
        </Text>
        <AddTrainTrip
          isOpen={isAddTripOpen}
          onClose={() => setIsAddTripOpen(false)}
        />
      </Flex>
    );

  if (!traintrips)
    return (
      <>
        <Flex flexDirection="column" gap={4} width="90%" margin="auto">
          <HStack justifyContent="space-between">
            <Box width="30%">
              {/* <NotImmediateSearch
                placeholder="berlin,munich"
                keyWord={keyWord}
                setKeyWord={setKeyWord}
              /> */}
            </Box>
            <Button
              className="train-secondary-button-color"
              onClick={() => setIsAddTripOpen(true)}
            >
              Add Trip
            </Button>
          </HStack>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.500"
            marginTop="auto"
            margin="auto"
            marginY={6}
          >
            No Trips Found
          </Text>
          <AddTrainTrip
            isOpen={isAddTripOpen}
            onClose={() => setIsAddTripOpen(false)}
          />
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
        bg="rgb(239, 236, 236)"
        _dark={{
          bg: "#222222",
        }}
        transition="background-color 0.2s"
      >
        <Box width="30%">
          {/* <NotImmediateSearch
            placeholder="berlin,munich"
            keyWord={keyWord}
            setKeyWord={setKeyWord}
          /> */}
        </Box>
        <Button
          className="train-secondary-button-color"
          onClick={() => setIsAddTripOpen(true)}
        >
          Add Trip
        </Button>
      </HStack>

      {traintrips.map((trip) => (
        <Card.Root
          size="lg"
          key={trip._id}
          onClick={() => {
            setIsUpdateTripOpen(true);
            setSelectedTrip(trip._id);
          }}
          cursor="pointer"
          borderWidth={2}
          borderRadius="lg"
          transition="all 0.2s ease"
          _hover={{
            borderColor: "#ffccbc",
            transform: "translateY(-1px)",
            shadow: "lg",
          }}
        >
          <Card.Body className="card" borderRadius="lg">
            <HStack justifyContent="space-between" mx={4}>
              <VStack alignItems="start">
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  color="#E84F0B"
                  _dark={{ color: "#DF440D" }}
                >
                  {trip.firstStation.code}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {trip.firstStation.city}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {trip.departureTime.substring(0, 10)}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {trip.departureTime.substring(11, 16)}
                </Text>
              </VStack>
              <VStack alignItems="center">
                <HStack>
                  <FaCircle size={10} color="#E84F0B" />
                  <Separator
                    flex="1"
                    width="500px"
                    size="md"
                    variant="dashed"
                    className="border-color"
                  />
                  <MdOutlineTrain size={25} color="#E84F0B" />
                  {/* <Text flexShrink="0">Label (center)</Text> */}
                  <Separator
                    flex="1"
                    size="md"
                    variant="dashed"
                    className="border-color"
                    // borderColor="#E84F0B"
                    // _dark={{ borderColor: "#DF440D" }}
                  />
                  <FaCircle size={10} color="#E84F0B" />
                </HStack>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {trip.duration}
                </Text>
              </VStack>
              <VStack alignItems="start">
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color="#E84F0B"
                  _dark={{ color: "#DF440D" }}
                >
                  {trip.lastStation.code}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {trip.lastStation.city}{" "}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {trip.arrivalTime.substring(0, 10)}
                </Text>
                <Text
                  fontWeight="semibold"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                >
                  {trip.arrivalTime.substring(11, 16)}
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
                {" "}
                Available Seats: {trip.availableSeats}
              </Text>
              <Text
                mr="12"
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                {" "}
                € {trip.price}
              </Text>
            </HStack>
          </Card.Body>
        </Card.Root>
      ))}
      <Box height="15px"></Box>
      <AddTrainTrip
        isOpen={isAddTripOpen}
        onClose={() => setIsAddTripOpen(false)}
      />
      {selectedTrip && (
        <UpdateTrainTrip
          isOpen={isUpdateTripOpen}
          onClose={() => {
            setIsUpdateTripOpen(false);
            setSelectedTrip("");
          }}
          tripId={selectedTrip}
          tripRoute={""}
          tripTrain={""}
          tripDeparture={""}
          tripPrice={0}
          tripStop={0}
        />
      )}
    </Flex>
  );
};

export default TrainTrips;
