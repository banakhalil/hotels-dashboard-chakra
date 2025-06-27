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
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { useAddHotel, type HotelData } from "@/hooks/useHotels";
import { toaster } from "../ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const amenitiesOptions = [
  "WiFi",
  "Parking",
  "Pool",
  "Gym",
  "Restaurant",
  "Room Service",
  "Spa",
  "AC",
];

const CreateHotel = ({ isOpen, onClose }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const starsRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<
    { file: File; preview: string }[]
  >([]);

  const addHotel = useAddHotel();

  // Handle file selection for cover image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

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
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      additionalImages.forEach((img) => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, [imagePreview, additionalImages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get all checked amenities
    const checkedAmenities = Array.from(
      formData.getAll("amenities")
    ) as string[];

    // Get all images from the form
    const images = Array.from(formData.getAll("images")) as File[];
    const coverImage = formData.get("coverImage") as File;

    const newHotel: HotelData = {
      name: formData.get("name")?.toString() || "",
      country: formData.get("country")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      location: formData.get("location")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      amenities: checkedAmenities,
      stars: parseInt(formData.get("stars")?.toString() || "1"),
      coverImage: coverImage,
      images: images,
      slug:
        formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-") ||
        "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create a new FormData for sending the file
    const formDataToSend = new FormData();
    Object.entries(newHotel).forEach(([key, value]) => {
      if (key === "amenities") {
        value.forEach((amenity: string) => {
          formDataToSend.append("amenities[]", amenity);
        });
      } else if (key === "coverImage" && value instanceof File) {
        formDataToSend.append("coverImage", value);
      } else if (key === "images" && Array.isArray(value)) {
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

    console.log("Debug - Final FormData entries:");
    for (let [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    addHotel.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Hotel created successfully");
        toaster.create({
          title: "Success",
          description: "Hotel created successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error creating hotel:", error);
        toaster.create({
          title: "Error",
          description:
            error instanceof Error
              ? // error.message === "Request failed with status code 400"
                //   ? "Hotel already exists"
                //   :
                error.message
              : "Failed to create hotel. Please try again.",
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
        if (!open) {
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
          }
          additionalImages.forEach((img) => {
            URL.revokeObjectURL(img.preview);
          });
          setAdditionalImages([]);
        }
        onClose();
      }}
      initialFocusEl={() => nameRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header className="drawer">
              <Dialog.Title>Add New Hotel</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4" zIndex={10} className="drawer">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input
                      name="name"
                      placeholder="Hotel Name"
                      ref={nameRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Input
                      name="description"
                      placeholder="Description"
                      ref={descriptionRef}
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
                    <Field.Label>Location</Field.Label>
                    <Input
                      name="location"
                      placeholder="Location"
                      ref={locationRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Stars</Field.Label>
                    <Input
                      name="stars"
                      placeholder="Stars"
                      ref={starsRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Amenities</Field.Label>
                    <Stack>
                      {amenitiesOptions.map((amenity) => (
                        <label
                          key={amenity}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="checkbox"
                            value={amenity}
                            name="amenities"
                            style={{ marginRight: "8px" }}
                          />
                          <Text>{amenity}</Text>
                        </label>
                      ))}
                    </Stack>
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
                    >
                      <HiUpload /> Add Image
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
                  <Field.Root>
                    <Field.Label>Add Hotel Images</Field.Label>
                    <input
                      type="file"
                      accept="image/*"
                      name="images"
                      multiple
                      style={{ display: "none" }}
                      id="hotelImages"
                      onChange={handleMultipleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("hotelImages")?.click()
                      }
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
                  <Button type="submit" className="hotel-button-color">
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
export default CreateHotel;
