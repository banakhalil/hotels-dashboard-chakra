"use client";

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
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "../ui/toaster";
import { useEvents } from "@/hooks/Trips/useEvents";
import { useGuides } from "@/hooks/Trips/useGuides";
import { useAddTrip } from "@/hooks/Trips/useTrips";
import { AxiosError } from "axios";
import { useTranslation } from "@/contexts/TranslationContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTrip = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const titleRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const maxGroupSizeRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  // const duration1Ref = useRef<HTMLInputElement>(null);
  // const duration2Ref = useRef<HTMLInputElement>(null);
  // const event1DateRef = useRef<HTMLInputElement>(null);
  // const event2DateRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  // const [selectedEvent1, setSelectedEvent1] = useState<string | null>(null);
  // const [selectedEvent2, setSelectedEvent2] = useState<string | null>(null);

  const addTrip = useAddTrip();
  const { data: guides } = useGuides();
  // const { data: events } = useEvents({ page: 1, pageSize: 1000 });

  const guideCollection = createListCollection({
    items:
      guides?.map((guide) => ({
        label: guide.user.firstName + " " + guide.user.lastName,
        value: guide._id,
      })) ?? [],
  });

  // const eventCollection = createListCollection({
  //   items:
  //     events?.map((event) => ({
  //       label: event.title,
  //       value: event._id,
  //     })) ?? [],
  // });

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
    const coverImage = formData.get("tripCover") as File;
    const newTrip = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      country: formData.get("country")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      price: parseInt(formData.get("price")?.toString() || "1000"),
      maxGroupSize: parseInt(formData.get("maxGroupSize")?.toString() || "10"),
      category: formData.get("category")?.toString() || "",
      tripCover: coverImage,
      guider: selectedGuide || "",
      // events: [
      //   {
      //     eventId: selectedEvent1,
      //     duration: parseInt(formData.get("duration1")?.toString() || "2"),
      //     startTime: formData.get("event1Date")?.toString() || "",
      //   },
      //   {
      //     eventId: selectedEvent2,
      //     duration: parseInt(formData.get("duration2")?.toString() || "2"),
      //     startTime: formData.get("event2Date")?.toString() || "",
      //   },
      // ],
    };

    // Create a new FormData for sending
    const formDataToSend = new FormData();
    Object.entries(newTrip).forEach(([key, value]) => {
      if (key === "tripCover" && value instanceof File) {
        formDataToSend.append("tripCover", value);
      }
      // else if (key === "events") {
      //   formDataToSend.append("events", JSON.stringify(value));
      // }
      else {
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    addTrip.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Trip added successfully");
        toaster.create({
          title: "Success",
          description: "Trip added successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error adding trip :", error);
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
                  "Failed to add trip. Please try again."
              : "Failed to add trip. Please try again.",
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
      initialFocusEl={() => titleRef.current}
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
            >
              <Dialog.Title className="translated-text">
                {t("buttons.addTrip")}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              pb="4"
              zIndex={10}
              className="drawer"
              borderBottomRadius="2xl"
            >
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack gap="4">
                  <Field.Root>
                    <Field.Label>Trip Title</Field.Label>
                    <Input
                      name="title"
                      placeholder="title"
                      ref={titleRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.description")}
                    </Field.Label>
                    <Textarea
                      name="description"
                      placeholder={t("common.description")}
                      className="border-color"
                      rows={4}
                      resize="vertical"
                      minHeight="100px"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.country")}
                    </Field.Label>
                    <Input
                      name="country"
                      placeholder={t("common.country")}
                      ref={countryRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.city")}
                    </Field.Label>
                    <Input
                      name="city"
                      placeholder={t("common.city")}
                      ref={cityRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.price")}
                    </Field.Label>
                    <Input
                      name="price"
                      placeholder={t("common.price")}
                      ref={priceRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.capacity")}
                    </Field.Label>
                    <Input
                      name="maxGroupSize"
                      placeholder={t("common.capacity")}
                      ref={maxGroupSizeRef}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.category")}
                    </Field.Label>
                    <Input
                      name="category"
                      placeholder={t("common.category")}
                      ref={categoryRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.tripGuide")}
                    </Field.Label>
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
                            <Select.ValueText
                              placeholder={t("common.selectGuide")}
                            />
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
                  {/* <Field.Root>
                    <Field.Label>Event 1</Field.Label>
                    <Box position="relative" zIndex="8">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={eventCollection}
                        size="sm"
                        width="460px"
                        value={selectedEvent1 ? [selectedEvent1] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedEvent1(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select Day 1 Event" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer " maxH="100px">
                            {eventCollection.items.map((event) => (
                              <Select.Item item={event} key={event.value}>
                                {event.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Event 1 Duration</Field.Label>
                    <Input
                      name="duration1"
                      placeholder="Duration"
                      ref={duration1Ref}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Event 1 Date & Time</Field.Label>
                    <Input
                      ref={event1DateRef}
                      name="event1Date"
                      type="datetime-local"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Event 2</Field.Label>
                    <Box position="relative" zIndex="6">
                      <Select.Root
                        className="drawer"
                        borderRadius="md"
                        borderWidth="1px"
                        collection={eventCollection}
                        size="sm"
                        width="460px"
                        value={selectedEvent2 ? [selectedEvent2] : []}
                        onValueChange={(v) => {
                          const value = Array.isArray(v.value)
                            ? v.value[0]
                            : v.value;
                          setSelectedEvent2(value);
                        }}
                      >
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select Day 2 Event" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.ClearTrigger>⨯</Select.ClearTrigger>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content className="drawer " height="100px">
                            {eventCollection.items.map((event) => (
                              <Select.Item item={event} key={event.value}>
                                {event.label}
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Box>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Event 2 Duration</Field.Label>
                    <Input
                      name="duration2"
                      placeholder="Duration"
                      ref={duration2Ref}
                      className="border-color"
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Event 2 Date & Time</Field.Label>
                    <Input
                      ref={event2DateRef}
                      name="event2Date"
                      type="datetime-local"
                    />
                  </Field.Root> */}
                  <Field.Root>
                    <Field.Label>Image</Field.Label>
                    <input
                      type="file"
                      accept="image/*"
                      name="tripCover"
                      style={{ display: "none" }}
                      id="cover"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("cover")?.click()}
                      className="border-color "
                    >
                      <HiUpload /> {t("buttons.addImage")}
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
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="translated-text"
                    >
                      {t("common.cancel")}
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    type="submit"
                    className="trip-button-color translated-text"
                    mt={2}
                  >
                    {t("common.add")}
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

export default CreateTrip;
