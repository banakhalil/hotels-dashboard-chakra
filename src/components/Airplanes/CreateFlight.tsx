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
} from "@chakra-ui/react";
import { useRef, useState, type FormEvent } from "react";
import { toaster } from "@/components/ui/toaster";
import { useCreateFlight } from "@/hooks/Airlines/useFlights";
import useAirplanes from "@/hooks/Airlines/useAirplanes";
import { useAirports, useCountries } from "@/hooks/Airlines/useFlights";
import { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFlight = ({ isOpen, onClose }: Props) => {
  // const departureAirportRef = useRef<HTMLInputElement>(null);
  // const arrivalAirportRef = useRef<HTMLInputElement>(null);
  // const departureCountryRef = useRef<HTMLInputElement>(null);
  // const arrivalCountryRef = useRef<HTMLInputElement>(null);
  const departureDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  // const gateRef = useRef<HTMLInputElement>(null);
  const economyRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);
  // const planeRef = useRef<HTMLInputElement>(null);

  const { data: planes } = useAirplanes();
  const createFlightMutation = useCreateFlight();
  const { data: airports } = useAirports();
  const { data: countries } = useCountries();

  const [selectedDepartureAirport, setSelectedDepartureAirport] =
    useState<string>("");
  const [selectedDepartureCountry, setSelectedDepartureCountry] =
    useState<string>("");
  const [selectedArrivalCountry, setSelectedArrivalCountry] =
    useState<string>("");
  const [selectedArrivalAirport, setSelectedArrivalAirport] =
    useState<string>("");
  const [selectedPlane, setSelectedPlane] = useState<string>("");

  const departureAirportsCollection = createListCollection({
    items:
      airports?.map((airport) => ({
        label: airport.name,
        value: airport.name,
      })) ?? [],
  });
  const arrivalAirportsCollection = createListCollection({
    items:
      airports?.map((airport) => ({
        label: airport.name,
        value: airport.name,
      })) ?? [],
  });
  const departureCountryCollection = createListCollection({
    items:
      countries?.map((country) => ({
        label: country.name,
        value: country.name,
      })) ?? [],
  });
  const arrivalCountryCollection = createListCollection({
    items:
      countries?.map((country) => ({
        label: country.name,
        value: country.name,
      })) ?? [],
  });
  const airplaneCollection = createListCollection({
    items:
      planes?.map((plane) => ({
        label: plane.model,
        value: plane._id,
      })) ?? [],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !selectedDepartureAirport ||
      !selectedArrivalAirport ||
      !selectedDepartureCountry ||
      !selectedArrivalCountry ||
      !selectedPlane ||
      !departureDateRef.current?.value ||
      !returnDateRef.current?.value ||
      !economyRef.current?.value ||
      !businessRef.current?.value ||
      // !gateRef.current?.value ||
      !durationRef.current?.value
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

    const formData = new FormData();
    formData.append("departureAirport", selectedDepartureAirport);
    formData.append("arrivalAirport", selectedArrivalAirport);
    formData.append("departureCountry", selectedDepartureCountry);
    formData.append("arrivalCountry", selectedArrivalCountry);
    formData.append("plane", selectedPlane);

    // Format dates to ISO string
    const departureDateValue = departureDateRef.current?.value || "";
    const returnDateValue = returnDateRef.current?.value || "";

    formData.append("departureDate", departureDateValue);
    formData.append("arrivalDate", returnDateValue);
    formData.append("returnDepartureDate", returnDateValue);

    formData.append("duration", durationRef.current?.value || "");
    // formData.append("gateNumber", gateRef.current?.value || "");
    formData.append("priceEconomy", economyRef.current?.value || "");
    formData.append("priceBusiness", businessRef.current?.value || "");

    try {
      await createFlightMutation.mutate(formData);

      toaster.create({
        title: "Success",
        description: "Flight Added successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });

      onClose();
    } catch (error) {
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
                "Failed to add flight. Please try again."
            : "Failed to add flight. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  return (
    <Dialog.Root scrollBehavior="inside" open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Add Flight</Dialog.Title>
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
                  <Field.Root>
                    <Field.Label>Departure Country</Field.Label>
                    <Box position="relative" zIndex={40}>
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={departureCountryCollection}
                        size="sm"
                        width="460px"
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedDepartureCountry(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select A Departure Country" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer ">
                            {departureCountryCollection.items.map(
                              (departureCountry) => (
                                <Select.Item
                                  item={departureCountry}
                                  key={departureCountry.value}
                                >
                                  {departureCountry.label}
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
                    <Field.Label>Arrival Country</Field.Label>
                    <Box position="relative" zIndex={30}>
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={departureCountryCollection}
                        size="sm"
                        width="460px"
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedArrivalCountry(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select A Arrival Country" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer ">
                            {arrivalCountryCollection.items.map(
                              (arrivalCountry) => (
                                <Select.Item
                                  item={arrivalCountry}
                                  key={arrivalCountry.value}
                                >
                                  {arrivalCountry.label}
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
                    <Field.Label>Departure Airport</Field.Label>
                    <Box position="relative" zIndex={20}>
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={departureAirportsCollection}
                        size="sm"
                        width="460px"
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
                    <Box position="relative" zIndex={10}>
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={arrivalAirportsCollection}
                        size="sm"
                        width="460px"
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
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Plane</Field.Label>
                    <Box position="relative" zIndex="5">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={airplaneCollection}
                        size="sm"
                        width="460px"
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
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Departure Date & Time</Field.Label>
                    <Input
                      ref={departureDateRef}
                      name="departureDate"
                      type="datetime-local"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Return Date & Time</Field.Label>
                    <Input
                      ref={returnDateRef}
                      name="returnDate"
                      type="datetime-local"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Duration (minutes)</Field.Label>
                    <Input ref={durationRef} name="duration" type="number" />
                  </Field.Root>

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

export default CreateFlight;
