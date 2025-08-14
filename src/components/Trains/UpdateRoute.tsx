import { useStationsContext } from "@/contexts/StationsContext";
import {
  Box,
  Button,
  createListCollection,
  Dialog,
  Field,
  Portal,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import useCities from "@/hooks/Trains/useCities";
import {
  type StationInRoute,
  useSpecificRoute,
  useUpdateRoute,
} from "@/hooks/Trains/useRoutes";
import { toaster } from "@/components/ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  routeId: string;
  routeName: string;
  routeStations: StationInRoute[];
}

const UpdateRoute = ({
  isOpen,
  onClose,
  routeId,

  routeStations,
}: Props) => {
  const cityRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const stationsRef = useRef<HTMLInputElement>(null);

  const { stations } = useStationsContext();

  const {
    data: cities,
    isLoading: citiesLoading,
    error: citiesError,
  } = useCities();

  const {
    data: specificRoute,
    isLoading: specificRouteLoading,
    error: specificRouteError,
  } = useSpecificRoute(routeId);

  const updateRouteMutation = useUpdateRoute(routeId);

  const [selectedStations, setSelectedStations] = useState<string[]>(
    routeStations.map((station) => station.station._id)
  );
  const [selectedDestination, setSelectedDestination] = useState<string>(
    routeStations[routeStations.length - 1].station.city
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    routeStations[0].station.city
  );

  useEffect(() => {
    // Update form values when specific room data is loaded
    if (specificRoute) {
      if (cityRef.current) {
        cityRef.current.value = specificRoute.stations[0].station.city;
      }
      if (destinationRef.current) {
        destinationRef.current.value =
          specificRoute.stations[
            specificRoute.stations.length - 1
          ].station.city;
      }
      if (stationsRef.current) {
        stationsRef.current.value = selectedStations.join(",");
      }
    }
  }, [specificRoute]);
  //   console.log("Cities in component:", cities);

  const stationCollection = createListCollection({
    items:
      stations?.map((station) => ({
        label: station.name + " - " + station.city,
        value: station._id,
      })) ?? [],
  });

  const cityCollection = createListCollection({
    items:
      cities?.map((city) => ({
        label: city,
        value: city,
      })) ?? [],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCity || !selectedDestination || selectedStations.length < 2) {
      toaster.create({
        title: "Validation Error",
        description:
          "Please select departure city, destination city, and at least 2 stations",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    try {
      const routeData = {
        name: `${selectedCity} - ${selectedDestination}`,
        stations: selectedStations.map((stationId) => ({ station: stationId })),
        isInternational: true, // You might want to determine this based on some logic
      };

      await updateRouteMutation.mutateAsync(routeData);

      toaster.create({
        title: "Success",
        description: "Route updated successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });

      // Reset form
      setSelectedCity("");
      setSelectedDestination("");
      setSelectedStations([]);
      onClose();
    } catch (error) {
      toaster.create({
        title: "Error",
        description:
          error instanceof Error
            ? error.message === "Request failed with status code 403"
              ? "you don't have permission to edit this route"
              : error.message
            : "Failed to update route. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  if (citiesLoading || specificRouteLoading) {
    return (
      <Dialog.Root open={isOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl">
              <Dialog.Header className="drawer" borderTopRadius="2xl">
                <Dialog.Title>Update Route</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text>Loading...</Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }

  if (citiesError || specificRouteError) {
    return (
      <Dialog.Root open={isOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl">
              <Dialog.Header className="drawer" borderTopRadius="2xl">
                s<Dialog.Title>Update Route</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text color="red.500">
                  {citiesError
                    ? citiesError.message + "cities error"
                    : specificRouteError
                    ? specificRouteError.message + "specific route error"
                    : "Unknown error"}
                </Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root scrollBehavior="inside" open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Update Route</Dialog.Title>
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
                  <Field.Root>
                    <Field.Label>City of Departure</Field.Label>
                    <Box position="relative" zIndex="dropdown">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={cityCollection}
                        size="sm"
                        width="460px"
                        value={selectedCity ? [selectedCity] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedCity(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select city of departure" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer ">
                            {cityCollection.items.map((city) => (
                              <Select.Item item={city} key={city.value}>
                                {city.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Destination City</Field.Label>
                    <Box position="relative" zIndex="docked">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={cityCollection}
                        size="sm"
                        width="460px"
                        value={selectedDestination ? [selectedDestination] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedDestination(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select destination city" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer">
                            {cityCollection.items.map((city) => (
                              <Select.Item item={city} key={city.value}>
                                {city.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
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
                  </Field.Root>
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

export default UpdateRoute;
