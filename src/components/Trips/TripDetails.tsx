import {
  useAddEventToTrip,
  useDeleteEvent,
  useSpecificTrip,
} from "@/hooks/Trips/useTrips";
import {
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Select,
  Portal,
  Stack,
  Text,
  VStack,
  createListCollection,
  Input,
} from "@chakra-ui/react";
import DefaultImage from "../../assets/defaultTrip.webp";

import { FaStar } from "react-icons/fa";
import { useRef, useState, useEffect, type FormEvent } from "react";
import { useEvents } from "@/hooks/Trips/useEvents";
import { toaster } from "../ui/toaster";
import { AxiosError } from "axios";
import { useTranslation } from "@/contexts/TranslationContext";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
};

const TripDetails = ({ isOpen, onClose, tripId }: Props) => {
  const { t } = useTranslation();
  const { data: specificTrip, isLoading } = useSpecificTrip(tripId);
  const { data: eventsData } = useEvents({ page: 1, pageSize: 1000 });
  const events = eventsData?.events || [];
  const [selectedEventAdd, setSelectedEventAdd] = useState<string | null>(null);
  const [isNestedAddEventOpen, setIsNestedAddEventOpen] = useState(false);
  const [isNestedDeleteEventOpen, setIsNestedDeleteEventOpen] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log("Add Event Dialog State:", isNestedAddEventOpen);
  }, [isNestedAddEventOpen]);

  useEffect(() => {
    console.log("Delete Event Dialog State:", isNestedDeleteEventOpen);
  }, [isNestedDeleteEventOpen]);
  const deleteEventMutation = useDeleteEvent();
  // const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const eventDateRef = useRef<HTMLInputElement>(null);

  const addEventToTrip = useAddEventToTrip(tripId);

  const eventCollection = createListCollection({
    items:
      events
        ?.filter(
          (event) =>
            !specificTrip?.events.some(
              (tripEvent) => tripEvent.eventId._id === event._id
            )
        )
        .map((event) => ({
          label: event.title + " - " + event.location.split(",")[1].trim(),
          value: event._id,
        })) ?? [],
  });

  if (isLoading) {
    return (
      <Dialog.Root open={isOpen} size="md">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl">
              <Dialog.Header className="drawer" borderTopRadius="2xl">
                {/* <Dialog.Title>Update Route</Dialog.Title> */}
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text className="translated-text">{t("common.loading")}</Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }
  if (!specificTrip) {
    return (
      <Dialog.Root open={isOpen} size="lg">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl">
              <Dialog.Header className="drawer" borderTopRadius="2xl">
                {/* <Dialog.Title>Update Flight</Dialog.Title> */}
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text color="red.500" className="translated-text">
                  {t("messages.tripNotFound")}
                </Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Send the data directly as an object
    addEventToTrip.mutate(
      {
        tripId,
        formData: {
          eventId: selectedEventAdd || "",
          duration: parseInt(formData.get("duration")?.toString() || "2"),
          startTime: formData.get("startTime")?.toString() || "",
        },
      },
      {
        onSuccess: () => {
          console.log("Event added successfully");
          toaster.create({
            title: "Success",
            description: "Event added successfully",
            type: "success",
            duration: 3000,
            closable: true,
          });
          onClose();
        },
        onError: (error) => {
          console.error("Error adding event :", error);
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
                    "Failed to add event. Please try again."
                : "Failed to add event. Please try again.",
            type: "error",
            duration: 5000,
            closable: true,
          });
        },
      }
    );
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => {
        setIsNestedAddEventOpen(false);
        setIsNestedDeleteEventOpen(false);
        onClose();
      }}
      size="md"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          filter={
            isNestedAddEventOpen || isNestedDeleteEventOpen
              ? " brightness(0.7)"
              : "none"
          }
        >
          <Dialog.Content borderRadius="2xl" className="drawer">
            <Dialog.Header borderTopRadius="2xl" className="drawer" p={3}>
              {/* <Dialog.Title>Trip Details</Dialog.Title> */}
            </Dialog.Header>
            <Dialog.Body
            // className={`drawer ${isNestedDialogOpen ? "dialog-dimmed" : ""}`}
            >
              <Image
                loading="eager"
                objectFit="cover"
                borderRadius="xl"
                h="300px"
                w="100%"
                src={
                  typeof specificTrip?.tripCover === "string"
                    ? `${specificTrip.tripCover}` // Add timestamp to force cache refresh
                    : specificTrip?.tripCover instanceof File
                    ? URL.createObjectURL(specificTrip.tripCover)
                    : DefaultImage
                }
                alt={DefaultImage}
              />
              <Box px={2}>
                <Flex justifyContent="space-between" width="full">
                  <Text
                    className="font-oswald"
                    fontWeight="bold"
                    fontSize="xl"
                    letterSpacing="wide"
                    mt={4}
                    mb={4}
                  >
                    {specificTrip?.title}
                  </Text>
                  <Text
                    textStyle="xl"
                    // fontWeight="medium"
                    fontWeight="normal"
                    letterSpacing="tight"
                    className="font-oswald"
                    mt="2"
                  >
                    ${specificTrip?.price}
                    {/* <Text as="span" fontWeight="light" fontSize="sm">
                    /night
                  </Text> */}
                  </Text>
                </Flex>
                {/* <Flex gap={6} width="fit-content" mb={2}>
                  <HStack>
                    <IoLocationOutline size="18" color="gray" />
                    <Text
                      className="font-oswald"
                      fontSize="sm"
                      letterSpacing="wide"
                      color="gray.700"
                    >
                      {specificTrip?.city + ", " + specificTrip?.country}
                    </Text>
                  </HStack>
                  <HStack>
                    <Hourglass size="16" color="gray" />
                    <Text
                      className="font-oswald"
                      fontSize="sm"
                      letterSpacing="wide"
                      color="gray.700"
                    >
                      {specificTrip?.duration + " Days"}
                    </Text>
                  </HStack>
                  <HStack>
                    <PersonStandingIcon size="20" color="gray" />
                    <Text
                      className="font-oswald"
                      fontSize="sm"
                      letterSpacing="wide"
                      color="gray.700"
                    >
                      {specificTrip?.maxGroupSize}
                    </Text>
                  </HStack>
                </Flex> */}
                <Box my={4}>
                  <Text
                    fontSize="xl"
                    fontWeight="medium"
                    letterSpacing="wide"
                    className="font-oswald"
                    my="2"
                  >
                    Guide
                  </Text>
                  <Flex justifyContent="space-between">
                    <VStack alignItems="start">
                      <Text
                        fontSize="md"
                        fontWeight="normal"
                        color="gray.700"
                        _dark={{
                          color: "gray.400",
                        }}
                        letterSpacing="wide"
                        className="font-oswald"
                      >
                        {specificTrip?.guider.user.firstName +
                          " " +
                          specificTrip?.guider.user.lastName}
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="normal"
                        color="gray.700"
                        _dark={{
                          color: "gray.400",
                        }}
                        letterSpacing="wide"
                        className="font-oswald"
                      >
                        {specificTrip.guider.user.email}
                      </Text>
                    </VStack>
                    <VStack alignItems="start">
                      <HStack>
                        <FaStar color="rgb(255,192,0)" />
                        <Text
                          fontSize="sm"
                          // fontWeight="medium"
                          color="gray.700"
                          _dark={{
                            color: "gray.400",
                          }}
                          letterSpacing="wide"
                          className="font-oswald"
                        >
                          {specificTrip.guider.rating}
                        </Text>
                      </HStack>
                      <Text
                        fontSize="sm"
                        // fontWeight="medium"
                        color="gray.700"
                        _dark={{
                          color: "gray.400",
                        }}
                        letterSpacing="wide"
                        className="font-oswald"
                      >
                        {specificTrip.guider.yearsOfExperience + " years"}
                      </Text>
                    </VStack>
                  </Flex>
                </Box>
                <Box mt={8}>
                  <Text
                    fontSize="xl"
                    fontWeight="medium"
                    letterSpacing="wide"
                    className="font-oswald"
                    my="2"
                  >
                    Description
                  </Text>
                  <Text
                    // textStyle="md"
                    fontSize="md"
                    fontWeight="normal"
                    letterSpacing="wide"
                    className="font-oswald"
                    color="gray.700"
                    _dark={{
                      color: "gray.400",
                    }}
                    mt="2"
                  >
                    {specificTrip?.description}
                  </Text>
                </Box>
                <Box mt={8}>
                  {specificTrip.events.length ? (
                    <>
                      <Text
                        fontSize="xl"
                        fontWeight="medium"
                        letterSpacing="wide"
                        className="font-oswald"
                        my="2"
                      >
                        Events
                      </Text>
                      <Grid templateColumns="repeat(1,1fr)">
                        {/* <HStack my={2}> */}
                        {specificTrip.events.map((event) => (
                          <GridItem key={event._id} colSpan={1} mt={1}>
                            <Flex justifyContent="space-between">
                              <HStack>
                                <Text
                                  fontSize="md"
                                  fontWeight="normal"
                                  // fontWeight="medium"
                                  letterSpacing="wide"
                                  className="font-oswald"
                                >
                                  {event.order}:
                                </Text>
                                <Text
                                  fontSize="md"
                                  fontWeight="normal"
                                  color="gray.700"
                                  _dark={{
                                    color: "gray.400",
                                  }}
                                  letterSpacing="wide"
                                  className="font-oswald"
                                >
                                  {" "}
                                  {event.eventId.title}
                                </Text>
                              </HStack>
                              <Text
                                fontSize="sm"
                                // fontWeight="medium"
                                color="gray.700"
                                _dark={{
                                  color: "gray.400",
                                }}
                                letterSpacing="wide"
                                className="font-oswald"
                              >
                                {event.startTime.substring(0, 10)}
                                {/* {event.startTime.substring(11, 16) +
                                  " - " +
                                  event.endTime.substring(11, 16)} */}
                              </Text>
                            </Flex>
                          </GridItem>
                        ))}
                        {/* </HStack> */}
                      </Grid>
                    </>
                  ) : null}
                </Box>
              </Box>
            </Dialog.Body>

            <Dialog.Footer
              // className={`drawer ${isNestedDialogOpen ? "dialog-dimmed" : ""}`}
              borderBottomRadius="2xl"
            >
              {/* <Button variant="outline" onClick={onClose}>
                Cancel
              </Button> */}

              <Dialog.Root
                placement="center"
                open={isNestedDeleteEventOpen}
                onOpenChange={(details) =>
                  details.open
                    ? setIsNestedDeleteEventOpen(true)
                    : setIsNestedDeleteEventOpen(false)
                }
              >
                <Dialog.Trigger asChild>
                  <Button
                    borderRadius="full"
                    size="sm"
                    variant="subtle"
                    colorPalette="red"
                  >
                    -
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content borderRadius="2xl" className="drawer">
                      <Dialog.Header
                        borderTopRadius="2xl"
                        className="drawer"
                        pt={3}
                      >
                        {/* <Dialog.Title>Remove Title</Dialog.Title> */}
                      </Dialog.Header>
                      <Dialog.Body borderBottomRadius="2xl" className="drawer">
                        <Stack gap={4}>
                          {specificTrip.events.map((event) => (
                            <Flex
                              key={event._id}
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Text
                                color="gray.700"
                                _dark={{
                                  color: "gray.400",
                                }}
                              >
                                {event.eventId.title}
                              </Text>

                              <Button
                                className="trip-button-color"
                                onClick={() => {
                                  deleteEventMutation.mutate({
                                    tripId,
                                    eventId: event.eventId._id,
                                  });
                                  // onClose();
                                }}
                                colorScheme="red"
                                size="sm"
                              >
                                {t("common.remove")}
                              </Button>
                            </Flex>
                          ))}
                        </Stack>
                      </Dialog.Body>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

              <Dialog.Root
                placement="center"
                open={isNestedAddEventOpen}
                onOpenChange={(details) =>
                  details.open
                    ? setIsNestedAddEventOpen(true)
                    : setIsNestedAddEventOpen(false)
                }
              >
                <Dialog.Trigger asChild>
                  <Button
                    borderRadius="full"
                    size="sm"
                    variant="subtle"
                    colorPalette="green"
                  >
                    +
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content borderRadius="2xl" className="drawer">
                      <Dialog.Header borderTopRadius="2xl" className="drawer">
                        {/* <Dialog.Title>Add Title</Dialog.Title> */}
                      </Dialog.Header>
                      <Dialog.Body borderBottomRadius="2xl" className="drawer">
                        <form
                          onSubmit={handleAddSubmit}
                          encType="multipart/form-data"
                        >
                          <Stack gap={4}>
                            <Field.Root>
                              <Field.Label className="translated-text">
                                {t("common.event")}
                              </Field.Label>
                              <Box position="relative" zIndex="8">
                                <Select.Root
                                  className="drawer"
                                  borderRadius="md"
                                  borderWidth="1px"
                                  collection={eventCollection}
                                  size="sm"
                                  width="460px"
                                  value={
                                    selectedEventAdd ? [selectedEventAdd] : []
                                  }
                                  onValueChange={(v) => {
                                    const value = Array.isArray(v.value)
                                      ? v.value[0]
                                      : v.value;
                                    setSelectedEventAdd(value);
                                  }}
                                >
                                  <Select.Control>
                                    <Select.Trigger>
                                      <Select.ValueText
                                        placeholder={t("common.selectEvent")}
                                      />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                      <Select.ClearTrigger>
                                        ⨯
                                      </Select.ClearTrigger>
                                      <Select.Indicator />
                                    </Select.IndicatorGroup>
                                  </Select.Control>
                                  <Select.Positioner>
                                    <Select.Content
                                      className="drawer "
                                      maxH="120px"
                                    >
                                      {eventCollection.items.map((event) => (
                                        <Select.Item
                                          item={event}
                                          key={event.value}
                                        >
                                          {event.label}
                                          <Select.ItemIndicator>
                                            ✓
                                          </Select.ItemIndicator>
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Positioner>
                                </Select.Root>
                              </Box>
                            </Field.Root>
                            <Field.Root>
                              <Field.Label className="translated-text">
                                {t("common.eventDuration")}
                              </Field.Label>
                              <Input
                                name="duration"
                                placeholder={t("common.duration")}
                                ref={durationRef}
                                className="border-color"
                              />
                            </Field.Root>
                            <Field.Root>
                              <Field.Label className="translated-text">
                                {t("common.eventDateTime")}
                              </Field.Label>
                              <Input
                                ref={eventDateRef}
                                name="startTime"
                                type="datetime-local"
                              />
                            </Field.Root>
                          </Stack>
                          <Dialog.Footer className="drawer">
                            {/* <Dialog.ActionTrigger asChild>
                          <Button variant="outline" onClick={onClose}>
                            Cancel
                          </Button>
                        </Dialog.ActionTrigger> */}
                            {/* <Button
                              className="car-button-color"
                              onClick={() => {
                                setIsNestedAddEventOpen(false);
                              }}
                            >
                              Cancel
                            </Button> */}
                            <Button
                              type="submit"
                              className="trip-button-color"
                              mt={2}
                            >
                              {t("common.add")}
                            </Button>
                          </Dialog.Footer>
                        </form>
                      </Dialog.Body>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

              <Dialog.Root>
                {/* <Dialog.Trigger asChild>
                  <Button>Open Edit</Button>
                </Dialog.Trigger> */}
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content borderRadius="2xl">
                      <Dialog.Header borderTopRadius="2xl">
                        {/* <Dialog.Title>Edit Title</Dialog.Title> */}
                      </Dialog.Header>
                      <Dialog.Body borderBottomRadius="2xl"></Dialog.Body>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TripDetails;
