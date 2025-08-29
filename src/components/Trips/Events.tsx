import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Image,
  Card,
  HStack,
  Button,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { StaysSkeleton } from "./Skeletons";
import { IoLocationOutline } from "react-icons/io5";
import DefaultImage from "../../assets/airplane2.jpg";
import { useEvents } from "@/hooks/Trips/useEvents";
import CreateEvent from "./CreateEvent";
import { useState } from "react";
import EditEvent from "./EditEvent";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type Props = {};

const Events = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { data, isLoading, error } = useEvents({
    page: currentPage,
    pageSize,
  });

  // Extract events and pagination from the response
  const events = data?.events || [];
  const pagination = data?.pagination;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
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
        Error loading events
      </Text>
    );

  if (!events?.length)
    return (
      <>
        <HStack
          marginX={8}
          my={4}
          justifyContent="space-between"
          display="flex"
        >
          <Box width="30%"></Box>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="trip-button-color"
          >
            Add Event
          </Button>
        </HStack>
        {isAddOpen && (
          <CreateEvent isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
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
            No events found
          </Text>
        </Flex>
      </>
    );

  return (
    <>
      <HStack marginX={8} my={4} justifyContent="space-between" display="flex">
        <Box width="30%"></Box>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="trip-button-color"
        >
          Add Event
        </Button>
      </HStack>
      <Grid templateColumns="repeat(4, 1fr)" gap={6} margin={8}>
        {events.map((event) => (
          <GridItem
            borderRadius="2xl"
            key={event._id}
            cursor="pointer"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
            }}
            onClick={() => {
              setSelectedEventId(event._id as string);
            }}
          >
            <Card.Root className="card" display="flex" borderRadius="2xl">
              <Box position="relative" blur="4xl">
                <Image
                  loading="eager"
                  objectFit="cover"
                  borderRadius="2xl"
                  h="450px"
                  w="100%"
                  src={
                    typeof event.cover === "string"
                      ? `${event.cover}`
                      : event.cover instanceof File
                      ? URL.createObjectURL(event.cover)
                      : DefaultImage
                  }
                  alt={DefaultImage}
                />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  minH="160px"
                  bgColor="blackAlpha.600"
                  borderBottomRadius="2xl"
                />
                <Box position="absolute" bottom="2" padding={4} zIndex={1}>
                  <Text
                    color="rgb(239, 236, 236)"
                    className="font-oswald"
                    letterSpacing="wide"
                    fontWeight="bold"
                    fontSize="lg"
                    textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                    mb={2}
                  >
                    {event.title}
                  </Text>
                  <Text
                    color="rgb(239, 236, 236)"
                    className="font-oswald"
                    letterSpacing="wider"
                    fontSize="sm"
                    fontWeight="normal"
                    textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                    mb={2}
                  >
                    {event.description}
                  </Text>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    width="auto"
                  >
                    <HStack gap={2}>
                      <IoLocationOutline color="rgb(239, 236, 236)" />
                      <Text
                        className="font-oswald"
                        letterSpacing="wide"
                        color="rgb(239, 236, 236)"
                        fontSize="sm"
                        textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                      >
                        {event.location}
                      </Text>
                    </HStack>
                  </Flex>
                </Box>
              </Box>
            </Card.Root>
            {selectedEventId === event._id && (
              <EditEvent
                eventId={event._id}
                isOpen={true}
                onClose={() => setSelectedEventId(null)}
              />
            )}
          </GridItem>
        ))}
      </Grid>

      {isAddOpen && (
        <CreateEvent isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
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

export default Events;
