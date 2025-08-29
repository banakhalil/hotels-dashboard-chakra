"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "../ui/toaster";
import { useAddAirline } from "@/hooks/Airlines/useAirlines";
import { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAirline = ({ isOpen, onClose }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addAirline = useAddAirline();

  // Handle file selection for cover image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // Cleanup preview URLs on unmount or dialog close
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get values from form
    const logo = formData.get("logo") as File;
    const newAirline = {
      name: formData.get("name")?.toString() || "",
      country: formData.get("country")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      logo: logo,
    };

    // Create a new FormData for sending
    const formDataToSend = new FormData();
    Object.entries(newAirline).forEach(([key, value]) => {
      if (key === "logo" && value instanceof File) {
        formDataToSend.append("logo", value);
      } else {
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    addAirline.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Airline created successfully");
        toaster.create({
          title: "Success",
          description: "Airline created successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error creating airline:", error);
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
                  "Failed to create airline. Please try again."
              : "Failed to create airline. Please try again.",
          type: "error",
          duration: 5000,
          closable: true,
        });
      },
    });
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
      initialFocusEl={() => nameRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Add Your Airline</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              p="4"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
              zIndex={10}
              className="drawer"
            >
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Airline Name</Field.Label>
                    <Input
                      name="name"
                      placeholder="Name"
                      ref={nameRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Country</Field.Label>
                    <Input
                      name="country"
                      placeholder="Country"
                      ref={countryRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                      name="description"
                      placeholder="Description"
                      className="border-color"
                      rows={4}
                      resize="vertical"
                      minHeight="100px"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label> Logo</Field.Label>
                    <input
                      type="file"
                      accept="image/*"
                      name="logo"
                      style={{ display: "none" }}
                      id="logo"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("logo")?.click()}
                      className="border-color "
                    >
                      <HiUpload /> Add Logo
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
export default CreateAirline;
