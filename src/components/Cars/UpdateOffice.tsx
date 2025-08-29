"use client";

import {
  Box,
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "../ui/toaster";
import { useUpdateOffice } from "@/hooks/Cars/useOffice";
import { AxiosError } from "axios";

interface UpdateOfficeProps {
  isOpen: boolean;
  onClose: () => void;
  officeId: string;
  name: string;
  phone: string;
  coverImage: File | string;
}

export const UpdateOffice = ({
  isOpen,
  onClose,
  officeId,
  name,
  phone,
  coverImage,
}: UpdateOfficeProps) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set initial image preview from existing coverImage
  useEffect(() => {
    if (typeof coverImage === "string") {
      setImagePreview(coverImage);
    } else if (coverImage instanceof File) {
      const url = URL.createObjectURL(coverImage);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverImage]);

  const updateOffice = useUpdateOffice(officeId);

  // Handle file selection for cover image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imagePreview && imagePreview !== coverImage) {
        URL.revokeObjectURL(imagePreview);
      }
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // Cleanup preview URLs on unmount or dialog close
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== coverImage) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, coverImage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Create a new FormData instance
    const formData = new FormData();

    // Get form values
    const name = nameRef.current?.value || "";
    const phone = phoneRef.current?.value || "";
    const coverImageInput = document.getElementById(
      "coverImage"
    ) as HTMLInputElement;
    const coverImageFile = coverImageInput?.files?.[0];

    // Append values to FormData
    formData.append("name", name);
    formData.append("phone", phone);

    // Handle coverImage cases:
    // 1. New file selected
    // 2. Existing image (string URL)
    // 3. No change to image
    if (coverImageFile) {
      formData.append("coverImage", coverImageFile);
    } else if (typeof coverImage === "string") {
      // If we want to keep the existing image, we need to tell the backend
      formData.append("existingCoverImage", coverImage);
    }

    // Call the mutation with the FormData
    updateOffice.mutate(formData, {
      onSuccess: () => {
        toaster.create({
          title: "Success",
          description: "Office updated successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error updating office:", error);
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
                  "Failed to update office. Please try again."
              : "Failed to update office. Please try again.",
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
          if (imagePreview && imagePreview !== coverImage) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
          }
          onClose();
        }
      }}
      initialFocusEl={() => nameRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Editing Office</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              pb="4"
              zIndex={10}
              className="drawer"
              maxH="100vh"
              overflowY="auto"
              borderBottomRadius="2xl"
            >
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input
                      defaultValue={name}
                      name="name"
                      placeholder="Office Name"
                      ref={nameRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Phone Number</Field.Label>
                    <Input
                      defaultValue={phone}
                      name="phone"
                      placeholder="Phone Number"
                      ref={phoneRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Cover Image</Field.Label>
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
                      className="border-color"
                    >
                      <HiUpload /> Change Image
                    </Button>
                    {imagePreview && (
                      <Box mt={2}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            maxHeight: "200px",
                            width: "100%",
                            objectFit: "contain",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    )}
                  </Field.Root>
                </Stack>
                <Dialog.Footer mt={4}>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" className="car-button-color">
                    Save Changes
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
