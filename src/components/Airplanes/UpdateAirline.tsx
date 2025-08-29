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
import { useUpdateAirline } from "@/hooks/Airlines/useAirlines";
import { useAirlinesContext } from "@/contexts/AirlinesContext";
import { toaster } from "@/components/ui/toaster";
import { AxiosError } from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const UpdateAirline = ({ isOpen, onClose }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { airline, isLoading } = useAirlinesContext();
  const updateAirlineMutation = useUpdateAirline();

  // Handle file selection for cover image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = airline?.name || "";
    if (countryRef.current) countryRef.current.value = airline?.country || "";
    if (descriptionRef.current)
      descriptionRef.current.value = airline?.description || "";
  }, [airline]);

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
      "image"
    ) as HTMLInputElement;
    const coverImageFile = coverImageInput?.files?.[0];

    // Create a new FormData for sending
    const formDataToSend = new FormData();

    // Append all data to FormData
    formDataToSend.append("name", nameRef.current?.value || "");
    formDataToSend.append("description", descriptionRef.current?.value || "");
    formDataToSend.append("country", countryRef.current?.value || "");

    // Only append logo if a new file is selected
    if (coverImageFile) {
      formDataToSend.append("logo", coverImageFile);
    }
    // No need to send the existing logo URL - the backend will keep the existing one

    try {
      await updateAirlineMutation.mutateAsync(formDataToSend);
      toaster.create({
        title: "Success",
        description: "Airline updated successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating airline:", error);
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
                "Failed to update airline. Please try again."
            : "Failed to update airline. Please try again.",
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
              <Dialog.Title>Update Airline</Dialog.Title>
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
                <Text>Loading airline details...</Text>
              ) : (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>Airline Name:</Field.Label>
                      <Input
                        name="airlineName"
                        placeholder="Name"
                        ref={nameRef}
                        className="border-color"
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Description:</Field.Label>
                      <Textarea
                        name="airlineDescription"
                        placeholder="Description"
                        ref={descriptionRef}
                        className="border-color"
                        rows={4}
                        resize="vertical"
                        minHeight="100px"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Country:</Field.Label>
                      <Input
                        name="country"
                        placeholder="country"
                        ref={countryRef}
                        className="border-color"
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Logo</Field.Label>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        style={{ display: "none" }}
                        id="image"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                        className="border-color"
                      >
                        <HiUpload /> Change Logo
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

export default UpdateAirline;
