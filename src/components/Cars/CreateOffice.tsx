"use client";

import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "../ui/toaster";
import { useAddOffice } from "@/hooks/Cars/useOffice";
import { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOffice = ({ isOpen, onClose }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addOffice = useAddOffice();

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
    const coverImage = formData.get("coverImage") as File;
    const newOffice = {
      name: formData.get("name")?.toString() || "",
      country: formData.get("country")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      address: formData.get("address")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      coverImage: coverImage,
    };

    // Create a new FormData for sending
    const formDataToSend = new FormData();
    Object.entries(newOffice).forEach(([key, value]) => {
      if (key === "coverImage" && value instanceof File) {
        formDataToSend.append("coverImage", value);
      } else {
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    addOffice.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Office created successfully");
        toaster.create({
          title: "Success",
          description: "Office created successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error creating office:", error);
        toaster.create({
          title: "Error",
          description:
            error instanceof AxiosError
              ? error.response?.data.errors
                  .map((err: any) => err.msg)
                  .join(`  ////  `)
              : "Failed to create office. Please try again.",
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
            <Dialog.Header
              className="drawer"
              borderTopRadius="2xl"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
            >
              <Dialog.Title>Add Your Office</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4" zIndex={10} className="drawer">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Office Name</Field.Label>
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
                    <Field.Label>City</Field.Label>
                    <Input
                      name="city"
                      placeholder="City"
                      ref={cityRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Address</Field.Label>
                    <Input
                      name="address"
                      placeholder="Address"
                      ref={addressRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Phone Number</Field.Label>
                    <Input
                      name="phone"
                      placeholder="Phone Number"
                      ref={phoneRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label> Logo</Field.Label>
                    <input
                      type="file"
                      accept="image/*"
                      name="coverImage"
                      style={{ display: "none" }}
                      id="coverImage"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("coverImage")?.click()
                      }
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
                  <Button type="submit" className="car-button-color">
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
export default CreateOffice;
