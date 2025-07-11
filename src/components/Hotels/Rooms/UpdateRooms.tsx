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
import { useSpecificRoom, useUpdateRoom } from "@/hooks/useHotels";
import { toaster } from "@/components/ui/toaster";

interface UpdateRoomProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  roomId: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  isAvailable: boolean;
  amenities: string[];
  image: File | string;
  isActive: boolean;
}

const amenitiesOptions = [
  "WiFi",
  "Room Service",
  "AC",
  "TV",
  "Balcony",
  "Sea View",
  "Mountain View",
];

export const UpdateRoom = ({
  isOpen,
  onClose,
  hotelId,
  roomId,
  roomType,
  capacity,
  pricePerNight,
  isAvailable,
  isActive,
  amenities,
  image,
}: UpdateRoomProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const roomTypeRef = useRef<HTMLInputElement>(null);
  const capacityRef = useRef<HTMLInputElement>(null);
  const pricePerNightRef = useRef<HTMLInputElement>(null);
  const isAvailableRef = useRef<HTMLSelectElement>(null);
  const isActiveRef = useRef<HTMLSelectElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const { data: specificRoom, isLoading } = useSpecificRoom(hotelId, roomId);
  const updateRoom = useUpdateRoom(hotelId, roomId);

  useEffect(() => {
    // Update form values when specific room data is loaded
    if (specificRoom) {
      if (pricePerNightRef.current) {
        pricePerNightRef.current.value = specificRoom.pricePerNight.toString();
      }
      if (isAvailableRef.current) {
        isAvailableRef.current.value = specificRoom.isAvailable
          ? "Available"
          : "Occupied";
      }
      if (isActiveRef.current) {
        isActiveRef.current.value = specificRoom.isActive
          ? "Active"
          : "Maintenance";
      }
      // Set image preview if it exists
      if (typeof specificRoom.image === "string") {
        setImagePreview(specificRoom.image);
      }
    }
  }, [specificRoom]);

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
  //   const removeAdditionalImage = (index: number) => {
  //     setAdditionalImages((prev) => {
  //       const newImages = [...prev];
  //       URL.revokeObjectURL(newImages[index].preview);
  //       newImages.splice(index, 1);
  //       return newImages;
  //     });
  //   };

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

    // Get isAvailable value and convert to boolean
    const isAvailableValue = formData.get("isAvailable")?.toString() || "";
    const isAvailableBoolean = isAvailableValue.toLowerCase() === "available";

    const isActiveValue = formData.get("isActive")?.toString() || "";
    const isActiveBoolean = isActiveValue.toLowerCase() === "active";

    // Get the files and log them
    const coverImageInput = document.getElementById(
      "image"
    ) as HTMLInputElement;
    const coverImageFile = coverImageInput?.files?.[0];

    // Use the new image if selected, otherwise use the existing image
    const imageToUse = coverImageFile || specificRoom?.image || image;

    // Create the room data object
    const RoomData: {
      pricePerNight: number;
      isAvailable: boolean;
      isActive: boolean;
      amenities: string[];
      image: File | string;
    } = {
      pricePerNight: parseInt(formData.get("pricePerNight")?.toString() || "1"),
      isAvailable: isAvailableBoolean,
      isActive: isActiveBoolean,
      amenities: checkedAmenities,
      // image: imageToUse,
      image: coverImageFile || specificRoom?.image || image,
    };

    // Create a new FormData for sending
    const formDataToSend = new FormData();

    // Append all data to FormData
    Object.entries(RoomData).forEach(([key, value]) => {
      if (key === "amenities" && Array.isArray(value)) {
        value.forEach((amenity) => {
          formDataToSend.append("amenities[]", amenity);
        });
      } else if (key === "image") {
        if (value instanceof File) {
          console.log("appending file image" + value.name);
          formDataToSend.append("image", value);
        } else if (typeof value === "string") {
          // If it's a string URL, we need to tell the server this is the existing image
          console.log("appending image url" + value);
          formDataToSend.append("image", value);
          formDataToSend.append("isExistingImage", "true");
        }
      } else {
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    console.log(formDataToSend);

    updateRoom.mutate(formDataToSend as any, {
      onSuccess: () => {
        toaster.create({
          title: "Success",
          description: "Room updated successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error updating room:", error);
        toaster.create({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to update room. Please try again.",
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
        }
        onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header className="drawer">
              <Dialog.Title>Editing Room</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4" zIndex={10} className="drawer">
              {isLoading ? (
                <Text>Loading room details...</Text>
              ) : (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>Price per night</Field.Label>
                      <Input
                        defaultValue={
                          specificRoom?.pricePerNight || pricePerNight
                        }
                        name="pricePerNight"
                        placeholder="Price Per Night"
                        ref={pricePerNightRef}
                        className="border-color"
                      />
                    </Field.Root>
                    {/* <Field.Root>
                      <Field.Label>Availability</Field.Label>
                      <Input
                        defaultValue={
                          specificRoom?.isAvailable || isAvailable
                            ? "Available"
                            : "Occupied"
                        }
                        name="isAvailable"
                        placeholder="Available or Occupied"
                        ref={isAvailableRef}
                      />
                    </Field.Root> */}
                    <Field.Root>
                      <Field.Label>Availability</Field.Label>
                      <select
                        name="isAvailable"
                        defaultValue={
                          specificRoom?.isAvailable || isAvailable
                            ? "Available"
                            : "Occupied"
                        }
                        ref={isAvailableRef}
                        className="border-color"
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <option value=""></option>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                      </select>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Status</Field.Label>
                      <select
                        name="isActive"
                        defaultValue={
                          specificRoom?.isActive || isActive
                            ? "Active"
                            : "Maintenance"
                        }
                        ref={isActiveRef}
                        className="border-color"
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <option value=""></option>
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
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
                              defaultChecked={specificRoom?.amenities.includes(
                                amenity
                              )}
                              style={{ marginRight: "8px" }}
                              className="border-color"
                            />
                            <Text>{amenity}</Text>
                          </label>
                        ))}
                      </Stack>
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Room Image</Field.Label>
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
                        <HiUpload /> Change Image
                      </Button>
                      {
                        imagePreview && (
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
                        )
                        // : (
                        //   typeof image === "string" && (
                        //     <img
                        //       src={image}
                        //       alt="Current"
                        //       style={{
                        //         marginTop: "8px",
                        //         maxHeight: "200px",
                        //         objectFit: "cover",
                        //         borderRadius: "4px",
                        //       }}
                        //     />
                        //   )
                        // )
                      }
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
                </form>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
