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
import { useUpdateHotel } from "@/hooks/Hotels/useHotels";
import { toaster } from "../ui/toaster";

interface UpdateHotelProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  name: string;
  location: string;
  country: string;
  city: string;
  description: string;
  amenities: string[];
  stars: number;
  coverImage: File | string;
  images: (File | string)[];
  // rooms: RoomData[];
}

const amenitiesOptions = [
  "WiFi",
  "Parking",
  "Pool",
  "Gym",
  "Restaurant",
  "Spa",
];

export const UpdateHotel = ({
  isOpen,
  onClose,
  hotelId,
  name,
  location,
  country,
  city,
  description,
  amenities,
  stars,
  coverImage,
  images,
}: UpdateHotelProps) => {
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

  const updateHotel = useUpdateHotel(hotelId);

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

    // Get the files and log them
    const coverImageInput = document.getElementById(
      "coverImage"
    ) as HTMLInputElement;
    const coverImageFile = coverImageInput?.files?.[0];

    console.log("Debug - Cover Image Input:", {
      hasFiles: Boolean(coverImageInput?.files?.length),
      coverImageFile,
      existingCoverImage: coverImage,
    });

    console.log("Debug - Additional Images:", {
      existingImages: images,
      newImages: additionalImages,
    });

    // Create the hotel data object first
    const hotelData: {
      name: string;
      country: string;
      city: string;
      location: string;
      description: string;
      stars: number;
      amenities: string[];
      coverImage: File | string;
      images: (File | string)[];
      slug: string;
      updatedAt: string;
    } = {
      name: formData.get("name")?.toString() || "",
      country: formData.get("country")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      location: formData.get("location")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      stars: parseInt(formData.get("stars")?.toString() || "1"),
      amenities: checkedAmenities,
      coverImage: coverImageFile || coverImage,
      images: [...(images || []), ...additionalImages.map((img) => img.file)],
      slug:
        formData.get("name")?.toString().toLowerCase().replace(/\s+/g, "-") ||
        "",
      updatedAt: new Date().toISOString(),
    };

    console.log("Debug - Hotel Data Object:", {
      ...hotelData,
      coverImageType:
        hotelData.coverImage instanceof File
          ? "File"
          : typeof hotelData.coverImage,
      imagesTypes: hotelData.images.map((img) =>
        img instanceof File ? "File" : typeof img
      ),
    });

    // Create a new FormData for sending
    const formDataToSend = new FormData();

    // Append all data to FormData
    Object.entries(hotelData).forEach(([key, value]) => {
      if (key === "amenities" && Array.isArray(value)) {
        (value as string[]).forEach((amenity) => {
          formDataToSend.append("amenities[]", amenity);
        });
      } else if (key === "coverImage") {
        if (value instanceof File) {
          console.log("Debug - Appending cover image as File:", value.name);
          formDataToSend.append("coverImage", value);
        } else if (typeof value === "string") {
          console.log("Debug - Appending cover image as string:", value);
          formDataToSend.append("coverImage", value);
        }
      } else if (key === "images" && Array.isArray(value)) {
        // Clear any existing images array entries
        formDataToSend.delete("images");
        formDataToSend.delete("images[]");

        // Append each image with the correct field name
        (value as (File | string)[]).forEach((img, index) => {
          if (img instanceof File) {
            console.log(`Debug - Appending image ${index} as File:`, img.name);
            formDataToSend.append("images", img);
          } else if (typeof img === "string") {
            console.log(`Debug - Appending image ${index} as string:`, img);
            formDataToSend.append("images", img);
          }
        });
      } else {
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    // Log the final FormData contents
    console.log("Debug - Final FormData entries:");
    for (let [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    updateHotel.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Hotel updated successfully");
        toaster.create({
          title: "Success",
          description: "Hotel updated successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error updating hotel:", error);
        toaster.create({
          title: "Error",
          description:
            error instanceof Error
              ? // error.message === "Request failed with status code 400"
                //   ? "Hotel already exists"
                //   :
                error.message
              : "Failed to update hotel. Please try again.",
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
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Editing Hotel</Dialog.Title>
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
                    <Field.Label>Name</Field.Label>
                    <Input
                      defaultValue={name}
                      name="name"
                      placeholder="Hotel Name"
                      ref={nameRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Input
                      defaultValue={description}
                      name="description"
                      placeholder="Description"
                      ref={descriptionRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Country</Field.Label>
                    <Input
                      defaultValue={country}
                      name="country"
                      placeholder="Country"
                      ref={countryRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>City</Field.Label>
                    <Input
                      defaultValue={city}
                      name="city"
                      placeholder="City"
                      ref={cityRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Location</Field.Label>
                    <Input
                      defaultValue={location}
                      name="location"
                      placeholder="Location"
                      ref={locationRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Stars</Field.Label>
                    <Input
                      defaultValue={stars}
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
                            defaultChecked={
                              amenities.find((a) => a === amenity)
                                ? true
                                : false
                            }
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
                      className="border-color"
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
