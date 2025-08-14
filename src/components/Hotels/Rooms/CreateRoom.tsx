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
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { useAddRoom, type RoomData } from "@/hooks/Hotels/useHotels";
import { toaster } from "@/components/ui/toaster";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
}
const amenitiesOptions = ["AC", "TV", "Balcony", "Sea View"];

// Collections for select components
const roomTypeCollection = createListCollection({
  items: [
    { label: "Single", value: "Single" },
    { label: "Double", value: "Double" },
    { label: "Suite", value: "Suite" },
  ],
});

const availabilityCollection = createListCollection({
  items: [
    { label: "Available", value: "available" },
    { label: "Occupied", value: "occupied" },
  ],
});

const statusCollection = createListCollection({
  items: [
    { label: "Active", value: "active" },
    { label: "Maintenance", value: "maintenance" },
  ],
});

const CreateRoom = ({ isOpen, onClose, hotelId }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const capacityRef = useRef<HTMLInputElement>(null);
  const pricePerNightRef = useRef<HTMLInputElement>(null);
  const roomNumberRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  //   const [additionalImages, setAdditionalImages] = useState<
  //     { file: File; preview: string }[]
  //   >([]);

  const addRoom = useAddRoom();

  // Handle file selection for cover image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // Handle multiple file selection for additional images
  //   const handleMultipleFileChange = (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     const files = Array.from(event.target.files || []);
  //     const newImages = files.map((file) => ({
  //       file,
  //       preview: URL.createObjectURL(file),
  //     }));
  //     setAdditionalImages((prev) => [...prev, ...newImages]);
  //   };

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
      //   additionalImages.forEach((img) => {
      //     URL.revokeObjectURL(img.preview);
      //   });
    };
  }, [imagePreview]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get all checked amenities
    const checkedAmenities = Array.from(
      formData.getAll("amenities")
    ) as string[];

    // Get all images from the form
    // const images = Array.from(formData.getAll("images")) as File[];
    const image = formData.get("image") as File;

    const newRoom: RoomData = {
      // roomType: formData.get("roomType")?.toString() || "",
      roomType: selectedRoomType,
      capacity: parseInt(formData.get("capacity")?.toString() || "1"),
      pricePerNight: parseInt(formData.get("pricePerNight")?.toString() || "1"),
      // isAvailable: formData.get("isAvailable")?.toString() === "Available",
      // isActive: formData.get("isActive")?.toString() === "Active",
      isAvailable: selectedAvailability === "available" ? true : false,
      isActive: selectedStatus === "active" ? true : false,
      roomNumber: formData.get("roomNumber")?.toString() || "",
      amenities: checkedAmenities,
      image: image,
      hotel: hotelId,
    };

    // Create a new FormData for sending the file
    const formDataToSend = new FormData();
    Object.entries(newRoom).forEach(([key, value]) => {
      if (key === "amenities") {
        value.forEach((amenity: string) => {
          formDataToSend.append("amenities[]", amenity);
        });
      } else if (key === "image" && value instanceof File) {
        formDataToSend.append("image", value);
      }
      //   else if (key === "images" && Array.isArray(value)) {
      //     // Clear any existing images array entries
      //     formDataToSend.delete("images");
      //     formDataToSend.delete("images[]");

      //     value.forEach((file: File) => {
      //       formDataToSend.append("images", file);
      //     });
      //   }
      else if (key === "hotel") {
        formDataToSend.append("hotel", value?.toString() || "");
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

    addRoom.mutate(
      { hotelId, formData: formDataToSend as any },
      {
        onSuccess: () => {
          console.log("Room created successfully");
          // Reset all form fields and state
          setImagePreview(null);
          setSelectedRoomType("");
          setSelectedAvailability("");
          setSelectedStatus("");

          // Reset file input
          const fileInput = document.getElementById(
            "image"
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";

          toaster.create({
            title: "Success",
            description: "Room created successfully",
            type: "success",
            duration: 3000,
            closable: true,
          });
          onClose();
        },
        onError: (error) => {
          console.error("Error creating room:", error);
          toaster.create({
            title: "Error",
            description:
              error instanceof Error
                ? // error.message === "Request failed with status code 400"
                  //   ? "Room already exists"
                  //   :
                  error.message
                : "Failed to create room. Please try again.",
            type: "error",
            duration: 5000,
            closable: true,
          });
        },
      }
    );
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
          // additionalImages.forEach((img) => {
          //   URL.revokeObjectURL(img.preview);
          // });
          // setAdditionalImages([]);
        }
        onClose();
      }}

      // initialFocusEl={() => roomTypeRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Add New Hotel</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              p="4"
              maxH="100vh"
              overflowY="auto"
              zIndex={10}
              className="drawer"
              borderBottomRadius="2xl"
            >
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Room Type</Field.Label>
                    <Box position="relative" zIndex="dropdown">
                      <Select.Root
                        name="roomType"
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={roomTypeCollection}
                        size="sm"
                        width="460px"
                        value={selectedRoomType ? [selectedRoomType] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedRoomType(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select Room Type" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer">
                            {roomTypeCollection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Capacity</Field.Label>
                    <Input
                      name="capacity"
                      placeholder="Capacity"
                      ref={capacityRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Price Per Night</Field.Label>
                    <Input
                      name="pricePerNight"
                      placeholder="Price Per Night"
                      ref={pricePerNightRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Availability</Field.Label>
                    <Box position="relative" zIndex="docked">
                      <Select.Root
                        name="isAvailable"
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={availabilityCollection}
                        size="sm"
                        width="460px"
                        value={
                          selectedAvailability ? [selectedAvailability] : []
                        }
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedAvailability(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select Availability" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer">
                            {availabilityCollection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Status</Field.Label>
                    <Box position="relative" zIndex="2">
                      <Select.Root
                        name="isActive"
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={statusCollection}
                        size="sm"
                        width="460px"
                        value={selectedStatus ? [selectedStatus] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedStatus(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select Status" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer">
                            {statusCollection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Room Number</Field.Label>
                    <Input
                      name="roomNumber"
                      placeholder="Room Number"
                      ref={roomNumberRef}
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
                    <Field.Label> Image</Field.Label>
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
                      onClick={() => document.getElementById("image")?.click()}
                      className="border-color "
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
export default CreateRoom;
