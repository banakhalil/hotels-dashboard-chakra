
import {
  Box,
  Button,
  createListCollection,
  Dialog,
  Field,
  Input,
  Portal,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { toaster } from "@/components/ui/toaster";
import { useTrainsContext } from "@/contexts/TrainsContext";
import {
  useUpdateTrip,
  useSpecificTrainTrip,
} from "@/hooks/Trains/useTrainTrips";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  // tripRoute: string;
  tripTrain: string;
  tripDeparture: string;
  tripPrice: number;
  tripStop: number;
}

const UpdateTrainTrip = ({ isOpen, onClose, tripId }: Props) => {
  const priceRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const stopRef = useRef<HTMLInputElement>(null);

  const { data: specificTrip, isLoading, error } = useSpecificTrainTrip(tripId);
  console.log(specificTrip);
  const { trains } = useTrainsContext();
  // const { routes } = useRoutesContext();
  const [selectedTrain, setSelectedTrain] = useState<string>(
    specificTrip?.train || ""
  );
  //   const [selectedCity, setSelectedCity] = useState<string>("");
  // const [selectedRoute, setSelectedRoute] = useState<string>(
  //   specificTrip?.route || ""
  // );

  useEffect(() => {
    // Update form values when specific room data is loaded
    if (specificTrip) {
      // setSelectedRoute(specificTrip.route);
      setSelectedTrain(specificTrip.train);
      if (priceRef.current) {
        priceRef.current.value = specificTrip.price.toString();
      }
      if (dateRef.current) {
        dateRef.current.value = specificTrip.departureTime.substring(0, 10);
      }
      if (timeRef.current) {
        timeRef.current.value = specificTrip.departureTime.substring(11, 16);
      }
      if (stopRef.current) {
        stopRef.current.value = specificTrip.stopDuration.toString();
      }
    }
  }, [specificTrip]);

  //   const [selectedDate, setSelectedDate] = useState<string>("");
  //   const [selectedTime, setSelectedTime] = useState<string>("");
  //   const [selectedPrice, setSelectedPrice] = useState<string>("");
  //   const [selectedSeats, setSelectedSeats] = useState<string>("");
  //   const [selectedDuration, setSelectedDuration] = useState<string>("");
  const updateTripMutation = useUpdateTrip(tripId);

  //   console.log("Cities in component:", cities);

  const trainsCollection = createListCollection({
    items:
      trains?.map((train) => ({
        label: train.name,
        value: train._id,
      })) ?? [],
  });

  // const routesCollection = createListCollection({
  //   items:
  //     routes?.map((route) => ({
  //       label: route.name,
  //       value: route._id,
  //     })) ?? [],
  // });

  //   function formatDateTimeToISO(dateString:string, timeString = "00:00") {
  //     const [day, month, year] = dateString.split('-');
  //     const [hours, minutes] = timeString.split(':');

  //     const dateObj = new Date(year, month - 1, day, hours, minutes);
  //     return dateObj.toISOString();
  //   }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !selectedTrain ||
      // !selectedRoute ||
      !priceRef ||
      !dateRef ||
      !timeRef ||
      !stopRef
    ) {
      toaster.create({
        title: "Validation Error",
        description: "Please provide all info",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const tripData = {
        // route: selectedRoute,
        train: selectedTrain,
        price: parseInt(formData.get("price")?.toString() || "0"),
        departureTime: `${formData.get("date")?.toString()}T${formData.get(
          "time"
        )}:00.000Z`,
        stopDuration: parseInt(formData.get("stop")?.toString() || "0"),
      };
      console.log(tripData);
      await updateTripMutation.mutateAsync(tripData);

      toaster.create({
        title: "Success",
        description: "Trip updated successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });

      // Reset form
      setSelectedTrain("");
      // setSelectedRoute("");

      onClose();
    } catch (error) {
      toaster.create({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update trip. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Dialog.Root open={isOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl">
              <Dialog.Header className="drawer" borderTopRadius="2xl">
                <Dialog.Title>Add New Route</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text>Loading Trip...</Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }

  if (error) {
    return (
      <Dialog.Root open={isOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl">
              <Dialog.Header className="drawer" borderTopRadius="2xl">
                <Dialog.Title>Update Trip</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text color="red.500">
                  {error.message}
                  {/* Error loading trip. Please try again. */}
                </Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root
      scrollBehavior="inside"
      open={isOpen}
      onOpenChange={onClose}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Edit Trip</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              p="4"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
              className="drawer"
            >
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  {/* <Field.Root>
                    <Field.Label>Route</Field.Label>
                    <Box position="relative" zIndex="dropdown">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={routesCollection}
                        size="sm"
                        width="460px"
                        value={selectedRoute ? [selectedRoute] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedRoute(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select A Route" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer">
                            {routesCollection.items.map((route) => (
                              <Select.Item item={route} key={route.value}>
                                {route.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root> */}
                  <Field.Root>
                    <Field.Label>Train</Field.Label>
                    <Box position="relative" zIndex="docked">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={trainsCollection}
                        size="sm"
                        width="460px"
                        value={selectedTrain ? [selectedTrain] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedTrain(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select A Train" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer ">
                            {trainsCollection.items.map((train) => (
                              <Select.Item item={train} key={train.value}>
                                {train.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Price</Field.Label>
                    <Input
                      name="price"
                      placeholder="ticket price"
                      ref={priceRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Date</Field.Label>
                    <Input
                      type="date"
                      name="date"
                      placeholder="1-1-2025"
                      ref={dateRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Time</Field.Label>
                    <Input
                      type="time"
                      name="time"
                      placeholder="01:50"
                      ref={timeRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Stop Duration</Field.Label>
                    <Input
                      name="stop"
                      placeholder="type duration"
                      ref={stopRef}
                      className="border-color"
                    />
                  </Field.Root>
                  {/* <Field.Root> 
                    <Field.Label>Stations</Field.Label>
                    <Box position="relative" zIndex="2">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={stationCollection}
                        size="sm"
                        width="460px"
                        value={selectedStations}
                        onValueChange={(v) => {
                          setSelectedStations(
                            Array.isArray(v.value) ? v.value : [v.value]
                          );
                        }}
                        multiple
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select stations" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer">
                            {stationCollection.items.map((station) => (
                              <Select.Item item={station} key={station.value}>
                                {station.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root> */}
                </Stack>
                <Dialog.Footer mt="2">
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" className="train-button-color">
                    Update
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UpdateTrainTrip;
