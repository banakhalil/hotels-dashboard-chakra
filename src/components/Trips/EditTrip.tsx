import React from "react";
import {
  Box,
  Button,
  createListCollection,
  Dialog,
  Field,
  Input,
  Portal,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "@/components/ui/toaster";
import { useSpecificTrip, useUpdateTrip } from "@/hooks/Trips/useTrips";
import { useGuides } from "@/hooks/Trips/useGuides";
import { AxiosError } from "axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
};

const EditTrip = ({ isOpen, onClose, tripId }: Props) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const maxGroupSizeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: SpecificTrip, isLoading } = useSpecificTrip(tripId);

  const updateTrip = useUpdateTrip(tripId);
  const { data: guides } = useGuides();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  // Handle file selection for cover image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };
  const guideCollection = createListCollection({
    items:
      guides?.map((guide) => ({
        label: guide.user.firstName + " " + guide.user.lastName,
        value: guide._id,
      })) ?? [],
  });

  useEffect(() => {
    if (!SpecificTrip || isLoading) return;

    if (titleRef.current) titleRef.current.value = SpecificTrip.title;
    if (countryRef.current) countryRef.current.value = SpecificTrip.country;
    if (cityRef.current) cityRef.current.value = SpecificTrip.city;
    if (languageRef.current) languageRef.current.value = SpecificTrip.language;
    if (categoryRef.current) categoryRef.current.value = SpecificTrip.category;
    if (durationRef.current)
      durationRef.current.value = SpecificTrip.duration.toString();
    if (priceRef.current)
      priceRef.current.value = SpecificTrip.price.toString();
    if (maxGroupSizeRef.current)
      maxGroupSizeRef.current.value = SpecificTrip.maxGroupSize.toString();
    if (descriptionRef.current)
      descriptionRef.current.value = SpecificTrip.description;
    setSelectedGuide(SpecificTrip.guider._id);
  }, [SpecificTrip, isLoading]);

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
      "tripCover"
    ) as HTMLInputElement;
    const coverImageFile = coverImageInput?.files?.[0];

    // Create a new FormData for sending
    const formDataToSend = new FormData();

    // Append all data to FormData
    formDataToSend.append("title", titleRef.current?.value || "");
    formDataToSend.append("description", descriptionRef.current?.value || "");
    formDataToSend.append("country", countryRef.current?.value || "");
    formDataToSend.append("city", cityRef.current?.value || "");
    formDataToSend.append("language", languageRef.current?.value || "");
    formDataToSend.append("category", categoryRef.current?.value || "");
    formDataToSend.append("duration", durationRef.current?.value || "");
    formDataToSend.append("price", priceRef.current?.value || "");
    formDataToSend.append("maxGroupSize", maxGroupSizeRef.current?.value || "");
    formDataToSend.append("guider", selectedGuide || "");
    // Only append logo if a new file is selected
    if (coverImageFile) {
      formDataToSend.append("tripCover", coverImageFile);
    }
    // No need to send the existing logo URL - the backend will keep the existing one

    // Add the guide ID to the form data
    // formDataToSend.append("guider", selectedGuide || "");

    try {
      await updateTrip.mutateAsync(formDataToSend);
      toaster.create({
        title: "Success",
        description: "Trip updated successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating trip:", error);
      toaster.create({
        title: "Error",
        description:
          error instanceof AxiosError
            ? error.response?.data.errors
                .map((err: any) => err.msg)
                .join(`  ////  `)
            : "Failed to update trip. Please try again.",
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
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            <Dialog.Header className="drawer" borderTopRadius="2xl">
              <Dialog.Title>Edit Trip</Dialog.Title>
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
                <Text>Loading trip details...</Text>
              ) : (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label>Trip Title:</Field.Label>
                      <Input
                        name="title"
                        placeholder="Title"
                        ref={titleRef}
                        className="border-color"
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Description:</Field.Label>
                      <Textarea
                        name="description"
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
                        placeholder="Country"
                        ref={countryRef}
                        className="border-color"
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>City:</Field.Label>
                      <Input
                        name="city"
                        placeholder="City"
                        ref={cityRef}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Trip Guide:</Field.Label>
                      <Box position="relative" zIndex="10">
                        <Select.Root
                          className="drawer"
                          borderRadius="md"
                          borderWidth="1px"
                          collection={guideCollection}
                          size="sm"
                          width="460px"
                          value={selectedGuide ? [selectedGuide] : []}
                          onValueChange={(v) => {
                            const value = Array.isArray(v.value)
                              ? v.value[0]
                              : v.value;
                            setSelectedGuide(value);
                          }}
                        >
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select A Guide" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.ClearTrigger>⨯</Select.ClearTrigger>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content className="drawer ">
                              {guideCollection.items.map((guide) => (
                                <Select.Item item={guide} key={guide.value}>
                                  {guide.label}
                                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </Box>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Language:</Field.Label>
                      <Input
                        name="language"
                        placeholder="Language"
                        ref={languageRef}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Category:</Field.Label>
                      <Input
                        name="category"
                        placeholder="Category"
                        ref={categoryRef}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Duration:</Field.Label>
                      <Input
                        name="duration"
                        placeholder="Duration"
                        ref={durationRef}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Price:</Field.Label>
                      <Input
                        name="price"
                        placeholder="Price"
                        ref={priceRef}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Max Group Size:</Field.Label>
                      <Input
                        name="maxGroupSize"
                        placeholder="Max Group Size"
                        ref={maxGroupSizeRef}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Image</Field.Label>
                      <input
                        type="file"
                        accept="image/*"
                        name="tripCover"
                        style={{ display: "none" }}
                        id="tripCover"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("tripCover")?.click()
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
                  </Stack>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                    </Dialog.ActionTrigger>
                    <Button type="submit" className="trip-button-color">
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

export default EditTrip;
