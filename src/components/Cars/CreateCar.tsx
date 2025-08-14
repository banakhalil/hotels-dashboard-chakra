"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Text,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "../ui/toaster";
import { useAddCar } from "@/hooks/Cars/useCars";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  officeId: string;
}
const statusOptions = ["available", "maintenance"];
const gearOptions = ["manual", "automatic"];
const fuelOptions = ["petrol", "diesel", "electric", "hybrid"];

const CreateCar = ({ isOpen, onClose, officeId }: Props) => {
  const brandRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);

  const seatsRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [additionalImages, setAdditionalImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const addCar = useAddCar(officeId);

  // Handle multiple file selection for additional images
  const handleMultipleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAdditionalImages((prev) => [...prev, ...newImages]);
  };

  // Remove an additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Cleanup preview URLs on unmount or dialog close
  useEffect(() => {
    return () => {
      additionalImages.forEach((img) => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, [additionalImages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get values from form
    const newCar = {
      brand: formData.get("brand")?.toString() || "",
      model: formData.get("model")?.toString() || "",
      gearType: formData.get("gearType")?.toString() || "manual",
      fuelType: formData.get("fuelType")?.toString() || "petrol",
      color: formData.get("color")?.toString() || "",
      status: formData.get("status")?.toString() || "available",
      seats: parseInt(formData.get("seats")?.toString() || "5"),
      year: parseInt(formData.get("year")?.toString() || "2020"),
      pricePerDay: parseInt(formData.get("pricePerDay")?.toString() || "300"),
      images: Array.from(formData.getAll("images")) as File[],
    };

    // Create a new FormData for sending
    const formDataToSend = new FormData();
    Object.entries(newCar).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        // Clear any existing images array entries
        formDataToSend.delete("images");
        formDataToSend.delete("images[]");

        value.forEach((file: File) => {
          formDataToSend.append("images", file);
        });
      } else {
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    addCar.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Car created successfully");
        toaster.create({
          title: "Success",
          description: "Car created successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error creating car:", error);
        toaster.create({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to create car. Please try again.",
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
          additionalImages.forEach((img) => {
            URL.revokeObjectURL(img.preview);
          });
          setAdditionalImages([]);
        }
        onClose();
      }}
      initialFocusEl={() => brandRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Add New Car</Dialog.Title>
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
                    <Field.Label>Brand</Field.Label>
                    <Input
                      name="brand"
                      placeholder="Brand"
                      ref={brandRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Model</Field.Label>
                    <Input
                      name="model"
                      placeholder="Model"
                      ref={modelRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Color</Field.Label>
                    <Input
                      name="color"
                      placeholder="Color"
                      ref={colorRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Seats</Field.Label>
                    <Input
                      name="seats"
                      placeholder="Seats"
                      ref={seatsRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Year</Field.Label>
                    <Input
                      name="year"
                      placeholder="Year"
                      ref={yearRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Price Per Day</Field.Label>
                    <Input
                      name="pricePerDay"
                      placeholder="Price Per Day"
                      ref={priceRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Fuel Type</Field.Label>
                    <HStack>
                      {fuelOptions.map((fuel) => (
                        <label
                          key={fuel}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="radio"
                            value={fuel}
                            name="fuelType"
                            defaultChecked={fuel === "petrol"}
                            style={{ marginRight: "8px" }}
                          />
                          <Text>{fuel}</Text>
                        </label>
                      ))}
                    </HStack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Gear Type</Field.Label>
                    <HStack>
                      {gearOptions.map((gear) => (
                        <label
                          key={gear}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="radio"
                            value={gear}
                            name="gearType"
                            defaultChecked={gear === "manual"}
                            style={{ marginRight: "8px" }}
                          />
                          <Text>{gear}</Text>
                        </label>
                      ))}
                    </HStack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Status</Field.Label>
                    <HStack>
                      {statusOptions.map((s) => (
                        <label
                          key={s}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="radio"
                            value={s}
                            name="status"
                            defaultChecked={s === "available"}
                            style={{ marginRight: "8px" }}
                          />
                          <Text>{s}</Text>
                        </label>
                      ))}
                    </HStack>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Add Car Images</Field.Label>
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
                    >
                      <HiUpload /> Upload Images
                    </Button>
                    <Stack direction="row" flexWrap="wrap" gap="2" mt="2">
                      {additionalImages.map((img, index) => (
                        <Box key={index} position="relative">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
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
                            onClick={() => removeAdditionalImage(index)}
                          >
                            ×
                          </Button>
                        </Box>
                      ))}
                    </Stack>
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
export default CreateCar;
