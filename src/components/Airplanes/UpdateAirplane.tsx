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
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "@/components/ui/toaster";
import {
  useSpecificAirplane,
  useUpdateAirplane,
} from "@/hooks/Airlines/useAirplanes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  planeId: string;
};

const UpdateAirplane = ({ isOpen, onClose, planeId }: Props) => {
  const economyRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);

  const { data: specificPlane, isLoading } = useSpecificAirplane(planeId);
  const updateAirplaneMutation = useUpdateAirplane(planeId);

  useEffect(() => {
    if (economyRef.current)
      economyRef.current.value = specificPlane?.seatsEconomy.toString() || "";
    if (businessRef.current)
      businessRef.current.value = specificPlane?.seatsBusiness.toString() || "";
  }, [specificPlane]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const economySeats = parseInt(economyRef.current?.value || "0");
    const businessSeats = parseInt(businessRef.current?.value || "0");

    // Validate inputs
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

    // Append all data to FormData with correct keys
    formDataToSend.append("seatsEconomy", economySeats.toString());
    formDataToSend.append("seatsBusiness", businessSeats.toString());

    try {
      await updateAirplaneMutation.mutateAsync(formDataToSend);
      toaster.create({
        title: "Success",
        description: "Airplane updated successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating airplane:", error);
      toaster.create({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update airplane. Please try again.",
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
              <Dialog.Title>Update Airplane</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              p="4"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
              zIndex={10}
              className="drawer"
            >
              {isLoading ? (
                <Text>Loading airplane details...</Text>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>Economy Seats:</Field.Label>
                      <Input
                        type="number"
                        name="seatsEconomy"
                        placeholder="Economy seats"
                        ref={economyRef}
                        className="border-color"
                        min="0"
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
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UpdateAirplane;
