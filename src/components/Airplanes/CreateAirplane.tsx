import React from "react";
import {
  Box,
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRef, type FormEvent } from "react";
import { toaster } from "@/components/ui/toaster";
import { useCreatePlane } from "@/hooks/Airlines/useAirplanes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateAirplane = ({ isOpen, onClose }: Props) => {
  const modelRef = useRef<HTMLInputElement>(null);
  const economyRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);
  const regNumRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const createPlaneMutation = useCreatePlane();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Get all values
    const model = modelRef.current?.value;
    const registrationNumber = regNumRef.current?.value;
    const currentLocation = locationRef.current?.value;
    const economySeats = parseInt(economyRef.current?.value || "0");
    const businessSeats = parseInt(businessRef.current?.value || "0");

    // Validate required fields
    if (!model || !registrationNumber || !currentLocation) {
      toaster.create({
        title: "Error",
        description: "Please fill in all required fields",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    // Validate numbers
    if (isNaN(economySeats) || isNaN(businessSeats)) {
      toaster.create({
        title: "Error",
        description: "Please enter valid numbers for seats",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (economySeats < 0 || businessSeats < 0) {
      toaster.create({
        title: "Error",
        description: "Seat numbers cannot be negative",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    // Create a new FormData for sending
    const formDataToSend = new FormData();
    formDataToSend.append("model", model);
    formDataToSend.append("registrationNumber", registrationNumber);
    formDataToSend.append("seatsEconomy", economySeats.toString());
    formDataToSend.append("seatsBusiness", businessSeats.toString());
    formDataToSend.append("currentLocation", currentLocation);

    try {
      await createPlaneMutation.mutateAsync(formDataToSend);
      toaster.create({
        title: "Success",
        description: "Airplane created successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error creating airplane:", error);
      toaster.create({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create airplane. Please try again.",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

  return (
    <Dialog.Root
      scrollBehavior="inside"
      open={isOpen}
      onOpenChange={(open) => {
        onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Add Airplane</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              p="4"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
              zIndex={10}
              className="drawer"
            >
              <form onSubmit={handleSubmit}>
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Model:</Field.Label>
                    <Input
                      name="model"
                      placeholder="plane model"
                      ref={modelRef}
                      className="border-color"
                      required
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Registration Number:</Field.Label>
                    <Input
                      name="registrationNumber"
                      placeholder="SD-LDG"
                      ref={regNumRef}
                      className="border-color"
                      required
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Economy Seats:</Field.Label>
                    <Input
                      type="number"
                      name="seatsEconomy"
                      placeholder="Economy seats"
                      ref={economyRef}
                      className="border-color"
                      min="0"
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Business Seats:</Field.Label>
                    <Input
                      type="number"
                      name="seatsBusiness"
                      placeholder="Business seats"
                      ref={businessRef}
                      className="border-color"
                      min="0"
                      required
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Current Location:</Field.Label>
                    <Input
                      name="currentLocation"
                      placeholder="location"
                      ref={locationRef}
                      className="border-color"
                      required
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

export default CreateAirplane;
