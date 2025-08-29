import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, type FormEvent } from "react";
import { toaster } from "@/components/ui/toaster";
import useFlights, { useUpdateFlight } from "@/hooks/Airlines/useFlights";
import useAirlines from "@/hooks/Airlines/useAirlines";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  flightId: string;
}

const UpdateFlight = ({ isOpen, onClose, flightId }: Props) => {
  // const departureAirportRef = useRef<HTMLInputElement>(null);
  // const arrivalAirportRef = useRef<HTMLInputElement>(null);
  const departureDateRef = useRef<HTMLInputElement>(null);
  // const durationRef = useRef<HTMLInputElement>(null);
  // const gateRef = useRef<HTMLInputElement>(null);
  const economyRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);

  const { data: airline } = useAirlines();
  const { data: flights } = useFlights(airline?._id || "");
  const flight = flights?.find((f) => f._id === flightId);
  const updateFlightMutation = useUpdateFlight(flightId);

  // const [selectedDepartureAirport, setSelectedDepartureAirport] =
  //   useState<string>(flight?.departureAirport.name || "");
  // //   const [selectedCity, setSelectedCity] = useState<string>("");
  // const [selectedArrivalAirport, setSelectedArrivalAirport] = useState<string>(
  //   flight?.arrivalAirport.name || ""
  // );
  //   const [selectedPlane, setSelectedPlane] = useState<string>(
  //     flight?.plane|| ""
  //   );

  useEffect(() => {
    if (flight) {
      // if (departureAirportRef.current) {
      //   departureAirportRef.current.value = flight.departureAirport.name;
      // }
      // if (arrivalAirportRef.current) {
      //   arrivalAirportRef.current.value = flight.arrivalAirport.name;
      // }
      if (departureDateRef.current) {
        departureDateRef.current.value = flight.departureDate.substring(0, 16);
      }
      // if (durationRef.current) {
      //   durationRef.current.value = flight.duration.toString();
      // }
      // if (gateRef.current) {
      //   gateRef.current.value = flight.gateNumber.toString();
      // }
      if (economyRef.current) {
        economyRef.current.value = flight.priceEconomy.toString();
      }
      if (businessRef.current) {
        businessRef.current.value = flight.priceBusiness.toString();
      }
    }
  }, [flight]);

  // const departureAirportsCollection = createListCollection({
  //   items:
  //     flights?.map((flight) => ({
  //       label: flight.departureAirport.name,
  //       value: flight._id,
  //     })) ?? [],
  // });
  // const arrivalAirportsCollection = createListCollection({
  //   items:
  //     flights?.map((flight) => ({
  //       label: flight.arrivalAirport.name,
  //       value: flight._id,
  //     })) ?? [],
  // });
  //   const airplaneCollection = createListCollection({
  //     items:
  //       planes?.map((plane) => ({
  //         label: plane.model,
  //         value: plane._id,
  //       })) ?? [],
  //   });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!flight) {
      toaster.create({
        title: "Error",
        description: "Flight not found",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    const formData = new FormData();
    // formData.append(
    //   "departureAirport",
    //   departureAirportRef.current?.value || ""
    // );
    // formData.append("arrivalAirport", arrivalAirportRef.current?.value || "");
    formData.append("departureDate", departureDateRef.current?.value || "");
    // formData.append("duration", durationRef.current?.value || "");
    // formData.append("gateNumber", gateRef.current?.value || "");
    formData.append("priceEconomy", economyRef.current?.value || "");
    formData.append("priceBusiness", businessRef.current?.value || "");

    try {
      await updateFlightMutation.mutateAsync(formData);

      toaster.create({
        title: "Success",
        description: "Flight updated successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });

      onClose();
    } catch (error) {
      toaster.create({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update flight. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  if (!flight) {
    return (
      <Dialog.Root open={isOpen}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl">
              <Dialog.Header className="drawer" borderTopRadius="2xl">
                <Dialog.Title>Update Flight</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4" className="drawer">
                <Text color="red.500">Flight not found</Text>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root scrollBehavior="inside" open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Update Flight</Dialog.Title>
              <Dialog.CloseTrigger onClick={onClose} />
            </Dialog.Header>
            <Dialog.Body
              p="4"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
              className="drawer"
            >
              <form onSubmit={handleSubmit}>
                <Stack gap="4">
                  {/* <Field.Root>
                    <Field.Label>Departure Airport</Field.Label>
                    <Input ref={departureAirportRef} name="departureAirport" />
                  </Field.Root> */}
                  {/* <Field.Root>
                    <Field.Label>Departure Airport</Field.Label>
                    <Box position="relative" zIndex="docked">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={departureAirportsCollection}
                        size="sm"
                        width="460px"
                        value={
                          selectedDepartureAirport
                            ? [selectedDepartureAirport]
                            : []
                        }
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedDepartureAirport(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select A Departure Airport" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer ">
                            {departureAirportsCollection.items.map(
                              (departureAirport) => (
                                <Select.Item
                                  item={departureAirport}
                                  key={departureAirport.value}
                                >
                                  {departureAirport.label}
                                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                                </Select.Item>
                              )
                            )}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Arrival Airport</Field.Label>
                    <Box position="relative" zIndex="docked">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={arrivalAirportsCollection}
                        size="sm"
                        width="460px"
                        value={
                          selectedArrivalAirport ? [selectedArrivalAirport] : []
                        }
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedArrivalAirport(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select An Arrival Airport" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer ">
                            {arrivalAirportsCollection.items.map(
                              (arrivalAirport) => (
                                <Select.Item
                                  item={arrivalAirport}
                                  key={arrivalAirport.value}
                                >
                                  {arrivalAirport.label}
                                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                                </Select.Item>
                              )
                            )}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root> */}
                  {/* <Field.Root>
                    <Field.Label>Plane</Field.Label>
                    <Box position="relative" zIndex="docked">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={airplaneCollection}
                        size="sm"
                        width="460px"
                        value={selectedPlane ? [selectedPlane] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedPlane(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select A Plane" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer ">
                            {airplaneCollection.items.map((plane) => (
                              <Select.Item item={plane} key={plane.value}>
                                {plane.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root> */}
                  <Field.Root>
                    <Field.Label>Departure Date & Time</Field.Label>
                    <Input
                      ref={departureDateRef}
                      name="departureDate"
                      type="datetime-local"
                    />
                  </Field.Root>

                  {/* <Field.Root>
                    <Field.Label>Duration (minutes)</Field.Label>
                    <Input ref={durationRef} name="duration" type="number" />
                  </Field.Root> */}

                  {/* <Field.Root>
                    <Field.Label>Gate Number</Field.Label>
                    <Input ref={gateRef} name="gateNumber" type="number" />
                  </Field.Root> */}

                  <Field.Root>
                    <Field.Label>Economy Price ($)</Field.Label>
                    <Input ref={economyRef} name="priceEconomy" type="number" />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Business Price ($)</Field.Label>
                    <Input
                      ref={businessRef}
                      name="priceBusiness"
                      type="number"
                    />
                  </Field.Root>
                </Stack>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" className="airline-button-color">
                    Save Changes
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

export default UpdateFlight;
