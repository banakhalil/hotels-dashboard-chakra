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
import { useState, type FormEvent } from "react";
import useCities from "@/hooks/Trains/useCities";
import { useAddRoute } from "@/hooks/Trains/useRoutes";
import { toaster } from "@/components/ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddRoute = ({ isOpen, onClose }: Props) => {
  const { stations } = useStationsContext();
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const {
    data: cities,
    isLoading: citiesLoading,
    error: citiesError,
  } = useCities();
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [international, setInternational] = useState<string>("");
  const addRouteMutation = useAddRoute();

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
  const internationalCollection = createListCollection({
    items: [
      { label: "local", value: "local" },
      { label: "international", value: "international" },
    ],
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
        isInternational: international === "international" ? true : false, // You might want to determine this based on some logic
      };

      await addRouteMutation.mutateAsync(routeData);

      toaster.create({
        title: "Success",
        description: "Route added successfully",
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
            ? error.message
            : "Failed to add route. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  if (citiesLoading) {
    return (
      <Dialog.Root open={isOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header className="drawer">
                <Dialog.Title>Add New Route</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text>Loading cities...</Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }

  if (citiesError) {
    return (
      <Dialog.Root open={isOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header className="drawer">
                <Dialog.Title>Add New Route</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text color="red.500">
                  Error loading cities. Please try again.
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
              <Dialog.Title>Add New Route</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              className="drawer"
              p="4"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
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
                  <Field.Root>
                    <Field.Label>Local or International</Field.Label>
                    <Box position="relative" zIndex="1">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={internationalCollection}
                        size="sm"
                        width="460px"
                        value={international ? ["international"] : ["local"]}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setInternational(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="local or international" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer">
                            {internationalCollection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
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
                    Add
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

export default AddRoute;
