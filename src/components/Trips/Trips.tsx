import {
  Grid,
  Box,
  Card,
  Flex,
  GridItem,
  HStack,
  Text,
  Image,
  Button,
  Badge,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";

import { IoLocationOutline } from "react-icons/io5";
import { StaysSkeleton } from "./Skeletons";
import { useTrips } from "@/hooks/Trips/useTrips";
import DefaultImage from "../../assets/defaultTrip.webp";
import { useState } from "react";
import TripDetails from "./TripDetails";
import CreateTrip from "./CreateTrip";
import { EditIcon } from "lucide-react";
import EditTrip from "./EditTrip";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Trips = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { data, isLoading, error } = useTrips({
    page: currentPage,
    pageSize,
  });
  const trips = data?.trips || [];
  const pagination = data?.pagination;

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
  if (isLoading)
    return (
      <Grid templateColumns="repeat(4, 1fr)" gap={6} margin={8}>
        {skeletons.map((skeleton) => (
          <GridItem key={skeleton} borderRadius="2xl">
            <StaysSkeleton key={skeleton} height="450px" />
          </GridItem>
        ))}
      </Grid>
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
        Error loading trips
      </Text>
    );

  if (!trips?.length)
    return (
      <>
        <HStack margin={8} justifyContent="space-between" display="flex">
          <Box width="30%"></Box>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="trip-button-color"
          >
            Add Trip
          </Button>
        </HStack>
        {isAddOpen && (
          <CreateTrip isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
        )}
        <Flex
          justify="center"
          align="start"
          h="100%"
          direction="column"
          gap={4}
          marginX={10}
          marginY={6}
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.500"
            marginTop="auto"
            margin="auto"
            textAlign="center"
          >
            No trips found
          </Text>
        </Flex>
      </>
    );

  return (
    <>
      <HStack marginX={8} my={4} justifyContent="space-between" display="flex">
        <Box width="30%"></Box>
        <Button
          className="trip-button-color"
          onClick={() => setIsAddOpen(true)}
        >
          Add Trip
        </Button>
      </HStack>
      <Grid templateColumns="repeat(4, 1fr)" gap={6} margin={8}>
        {trips.map((trip) => (
          <GridItem key={trip._id} borderRadius="2xl">
            <Card.Root
              className="card"
              key={trip._id as string}
              display="flex"
              borderRadius="2xl"
              cursor="pointer"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
              onClick={() => {
                setSelectedTripId(trip._id as string);
              }}
            >
              <Box position="relative" blur="4xl">
                <Image
                  loading="eager"
                  objectFit="cover"
                  borderRadius="2xl"
                  h="450px"
                  w="100%"
                  src={
                    typeof trip.tripCover === "string"
                      ? `${trip.tripCover}` // Add timestamp to force cache refresh
                      : trip.tripCover instanceof File
                      ? URL.createObjectURL(trip.tripCover)
                      : DefaultImage
                  }
                  alt={DefaultImage}
                />
                <Badge
                  variant="subtle"
                  colorPalette="blue"
                  position="absolute"
                  top={0}
                  right={0}
                  margin={4}
                >
                  {trip.category}
                </Badge>
                {/* <Button
                      fontSize="sm"
                      size="xs"
                      className="font-oswald"
                      borderRadius="4xl"
                      variant="subtle"
                      position="absolute"
                      top={0}
                      left={0}
                      margin={4}
                      // colorPalette="purple"
                    >
                     
                      <EditIcon size={8} />
                    </Button> */}
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  height="125px"
                  width="100%"
                  //   bgGradient="linear(to-t, blackAlpha.600, transparent)"
                  bgColor="blackAlpha.600"
                  borderBottomRadius="2xl"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  padding={4}
                  zIndex={1}
                  width="100%"
                >
                  <Text
                    color="rgb(239, 236, 236)"
                    // fontWeight="bold"
                    className="font-oswald"
                    letterSpacing="wide"
                    fontWeight="medium"
                    fontSize="sm"
                    textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                    mb={2}
                  >
                    {trip.duration} Days Trip
                  </Text>
                  <Text
                    color="rgb(239, 236, 236)"
                    className="font-oswald"
                    letterSpacing="wide"
                    fontWeight="bold"
                    fontSize="lg"
                    textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                    mb={1}
                  >
                    {trip.title}
                  </Text>
                  {/* <Text
                    //   position="absolute"
                    //   bottom="16"
                    //   left="4"
                    color="rgb(239, 236, 236)"
                    //   fontWeight="bold"
                    className="font-oswald"
                    letterSpacing="wide"
                    fontSize="xs"
                    textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                    // zIndex={1}
                    mb={1}
                  >
                    {trip.description}
                  </Text> */}
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    gap={4}
                  >
                    <HStack gap={2}>
                      <IoLocationOutline color="rgb(239, 236, 236)" />
                      <Text
                        color="rgb(239, 236, 236)"
                        className="font-oswald"
                        letterSpacing="wide"
                        fontSize="sm"
                        textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                      >
                        {trip.city + ", " + trip.country}
                      </Text>
                    </HStack>

                    <Button
                      fontSize="sm"
                      size="sm"
                      className="font-oswald trip-secondary-button-color"
                      borderRadius="4xl"
                      variant="subtle"
                      mt={1}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTripId(trip._id as string);
                        setIsEditOpen(true);
                      }}
                      // colorPalette="purple"
                    >
                      {/* Edit */}
                      <EditIcon />
                    </Button>
                  </Flex>
                </Box>
              </Box>
            </Card.Root>
            {selectedTripId === trip._id && (
              <TripDetails
                tripId={trip._id}
                isOpen={true}
                onClose={() => setSelectedTripId(null)}
              />
            )}
          </GridItem>
        ))}
      </Grid>
      {isAddOpen && (
        <CreateTrip isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      )}
      {isEditOpen && editingTripId && (
        <EditTrip
          tripId={editingTripId}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingTripId(null);
          }}
        />
      )}
      {/* Pagination */}
      {pagination && (
        <Flex
          justify="center"
          marginY={6}
          position="absolute"
          bottom={0}
          left="50%"
        >
          <ButtonGroup variant="subtle" size="sm" zIndex={10}>
            <IconButton
              disabled={!pagination.hasPreviousPage}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="trip-secondary-button-color"
            >
              <LuChevronLeft />
            </IconButton>

            {/* Page Numbers */}
            {Array.from({ length: pagination.numOfPages }, (_, index) => (
              <IconButton
                bgColor={currentPage === index + 1 ? "#164b9a" : "#bedbffd9"}
                color={
                  currentPage === index + 1 ? "rgb(245, 244, 244)" : "black"
                }
                key={index + 1}
                variant={currentPage === index + 1 ? "solid" : "subtle"}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </IconButton>
            ))}

            <IconButton
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="trip-secondary-button-color"
            >
              <LuChevronRight />
            </IconButton>
          </ButtonGroup>
        </Flex>
      )}
    </>
  );
};

export default Trips;
