"use client";

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
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "../ui/toaster";
import { useSpecificCar, useUpdateCar } from "@/hooks/Cars/useCars";
import { AxiosError } from "axios";

interface UpdateCarProps {
  isOpen: boolean;
  onClose: () => void;
  officeId: string;
  carId: string;
  status: string;
  price: number;
  images: (File | string)[];
}

const statusOptions = ["available", "booked", "maintenance"];

export const UpdateCar = ({
  isOpen,
  onClose,
  officeId,
  carId,
  price,
  status,
  images,
}: UpdateCarProps) => {
  const priceRef = useRef<HTMLInputElement>(null);
  const [currentImages, setCurrentImages] = useState<(File | string)[]>(
    images || []
  );

  const { data: specificCar } = useSpecificCar(officeId, carId);
  const updateCar = useUpdateCar(officeId, carId);

  // Handle file selection for images
  const handleMultipleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    setCurrentImages((prev) => [...prev, ...files]);
  };

  // Remove an image
  const removeImage = (index: number) => {
    setCurrentImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Update form values when specific car data is loaded
  useEffect(() => {
    if (specificCar) {
      if (priceRef.current) {
        priceRef.current.value = specificCar.pricePerDay.toString();
      }
      if (specificCar.images) {
        setCurrentImages(specificCar.images);
      }
    }
  }, [specificCar]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Add basic fields
    const selectedStatus = formData.get("status")?.toString();
    formData.set("status", selectedStatus || "available");
    formData.set("pricePerDay", formData.get("price")?.toString() || "300");

    // Debug logs
    console.log("Current Images:", currentImages);
    console.log("Selected Status:", selectedStatus);

    // Add images - handle both URLs and Files
    currentImages.forEach((image) => {
      if (image instanceof File) {
        console.log("Adding new image file:", image.name);
        formData.append("images", image);
      } else if (typeof image === "string") {
        console.log("Adding existing image URL:", image);
        formData.append("existingImages", image);
      }
    });

    // Debug the final FormData
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    updateCar.mutate(formData, {
      onSuccess: () => {
        toaster.create({
          title: "Success",
          description: "Car updated successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        toaster.create({
          title: "Error",
          description:
            error instanceof AxiosError
              ? error.response?.data.errors
                  .map((err: any) => err.msg)
                  .join(`  ////  `)
              : "Failed to update car. Please try again.",
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
        if (!open) onClose();
      }}
      initialFocusEl={() => priceRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Edit Car</Dialog.Title>
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
                    <Field.Label>Price</Field.Label>
                    <Input
                      defaultValue={price}
                      name="price"
                      placeholder="Price Per day"
                      ref={priceRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Status</Field.Label>
                    <Stack direction="row">
                      {statusOptions.map((s) => (
                        <label
                          key={s}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="radio"
                            value={s}
                            name="status"
                            defaultChecked={status === s}
                            style={{ marginRight: "8px" }}
                          />
                          <Text>{s}</Text>
                        </label>
                      ))}
                    </Stack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Edit Car Images</Field.Label>
                    <input
                      type="file"
                      accept="image/*"
                      name="images"
                      multiple
                      style={{ display: "none" }}
                      id="images"
                      onChange={handleMultipleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("images")?.click()}
                      className="border-color"
                    >
                      <HiUpload /> Upload Images
                    </Button>
                    <Stack direction="row" flexWrap="wrap" gap="2" mt="2">
                      {currentImages.map((image, index) => (
                        <Box key={index} position="relative">
                          <img
                            src={
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            }
                            alt={`Car Image ${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <Button
                            size="xs"
                            position="absolute"
                            top="1"
                            right="1"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </Box>
                      ))}
                    </Stack>
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
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
