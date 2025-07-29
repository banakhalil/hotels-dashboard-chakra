"use client";

import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useRef, type FormEvent } from "react";

import { toaster } from "../ui/toaster";
import { useAddTrain } from "@/hooks/Trains/useTrains";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const AddTrain = ({ isOpen, onClose }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const speedRef = useRef<HTMLInputElement>(null);
  const numberOfSeatsRef = useRef<HTMLInputElement>(null);

  const addTrain = useAddTrain();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get values from form
    const newTrain = {
      name: formData.get("name")?.toString() || "",

      speed: parseInt(formData.get("speed")?.toString() || "120"),
      numberOfSeats: parseInt(
        formData.get("numberOfSeats")?.toString() || "150"
      ),
    };

    // Create a new FormData for sending
    const formDataToSend = new FormData();
    Object.entries(newTrain).forEach(([key, value]) => {
      formDataToSend.append(key, value?.toString() || "");
    });

    addTrain.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Train created successfully");
        toaster.create({
          title: "Success",
          description: "Train created successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error creating train:", error);
        toaster.create({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to create train. Please try again.",
          type: "error",
          duration: 5000,
          closable: true,
        });
      },
    });
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        onClose();
      }}
      initialFocusEl={() => nameRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header className="drawer">
              <Dialog.Title>Add New Car</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4" zIndex={10} className="drawer">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Train Name</Field.Label>
                    <Input
                      name="name"
                      placeholder="Train Name"
                      ref={nameRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Speed</Field.Label>
                    <Input
                      name="speed"
                      placeholder="Speed"
                      ref={speedRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Seats</Field.Label>
                    <Input
                      name="numberOfSeats"
                      placeholder="Seats"
                      ref={numberOfSeatsRef}
                      className="border-color"
                    />
                  </Field.Root>
                </Stack>
                <Dialog.Footer mt={4}>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" className="train-button-color">
                    Add
                  </Button>
                </Dialog.Footer>
              </form>{" "}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default AddTrain;
