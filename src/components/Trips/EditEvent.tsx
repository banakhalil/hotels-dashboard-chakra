import React from "react";
import {
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
import { useSpecificEvent, useUpdateEvent } from "@/hooks/Trips/useEvents";
import { AxiosError } from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
};

const EditEvent = ({ isOpen, onClose, eventId }: Props) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: SpecificEvent, isLoading } = useSpecificEvent(eventId);

  const updateEvent = useUpdateEvent(eventId);

  // Handle file selection for cover image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  useEffect(() => {
    if (titleRef.current) titleRef.current.value = SpecificEvent?.title || "";
    if (locationRef.current)
      locationRef.current.value = SpecificEvent?.location || "";
    if (descriptionRef.current)
      descriptionRef.current.value = SpecificEvent?.description || "";
  }, [SpecificEvent]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get the files and log them
    const coverImageInput = document.getElementById(
      "cover"
    ) as HTMLInputElement;
    const coverImageFile = coverImageInput?.files?.[0];

    // Create a new FormData for sending
    const formDataToSend = new FormData();

    // Append all data to FormData
    formDataToSend.append("title", titleRef.current?.value || "");
    formDataToSend.append("description", descriptionRef.current?.value || "");
    formDataToSend.append("location", locationRef.current?.value || "");

    // Only append logo if a new file is selected
    if (coverImageFile) {
      formDataToSend.append("cover", coverImageFile);
    }
    // No need to send the existing logo URL - the backend will keep the existing one

    try {
      await updateEvent.mutateAsync(formDataToSend);
      toaster.create({
        title: "Success",
        description: "Event updated successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
      toaster.create({
        title: "Error",
        description:
          error instanceof AxiosError
            ? error.response?.data.errors
                .map((err: any) => err.msg)
                .join(`  ////  `)
            : "Failed to update event. Please try again.",
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
        if (!open) {
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
          }
        }
        onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Edit Event</Dialog.Title>
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
                <Text>Loading event details...</Text>
              ) : (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>Event Title:</Field.Label>
                      <Input
                        name="title"
                        placeholder="Title"
                        ref={titleRef}
                        className="border-color"
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Description:</Field.Label>
                      <Textarea
                        name="description"
                        placeholder="Description"
                        ref={descriptionRef}
                        className="border-color"
                        rows={4}
                        resize="vertical"
                        minHeight="100px"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Location:</Field.Label>
                      <Input
                        name="location"
                        placeholder="Location, City, Country"
                        ref={locationRef}
                        className="border-color"
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Image</Field.Label>
                      <input
                        type="file"
                        accept="image/*"
                        name="cover"
                        style={{ display: "none" }}
                        id="cover"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("cover")?.click()
                        }
                        className="border-color"
                      >
                        <HiUpload /> Change Image
                      </Button>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            marginTop: "8px",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      )}
                    </Field.Root>
                  </Stack>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                    </Dialog.ActionTrigger>
                    <Button type="submit" className="trip-button-color">
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

export default EditEvent;
