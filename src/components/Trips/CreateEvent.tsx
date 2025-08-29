"use client";

import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { toaster } from "../ui/toaster";
import { useAddEvent } from "@/hooks/Trips/useEvents";
import { AxiosError } from "axios";
import { useTranslation } from "@/contexts/TranslationContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEvent = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const titleRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addEvent = useAddEvent();

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
    const coverImage = formData.get("cover") as File;
    const newOffice = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      location: formData.get("location")?.toString() || "",
      cover: coverImage,
    };

    // Create a new FormData for sending
    const formDataToSend = new FormData();
    Object.entries(newOffice).forEach(([key, value]) => {
      if (key === "cover" && value instanceof File) {
        formDataToSend.append("cover", value);
      } else {
        formDataToSend.append(key, value?.toString() || "");
      }
    });

    addEvent.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Event added successfully");
        toaster.create({
          title: "Success",
          description: "Event added successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error adding event :", error);
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
                  "Failed to add event. Please try again."
              : "Failed to add event. Please try again.",
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
                {t("buttons.addEvent")}
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
                    <Field.Label className="translated-text">
                      {t("common.title")}
                    </Field.Label>
                    <Input
                      name="title"
                      placeholder={t("common.title")}
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
                      {t("common.location")}
                    </Field.Label>
                    <Input
                      name="location"
                      placeholder={t("common.location")}
                      ref={locationRef}
                      className="border-color"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label className="translated-text">
                      {t("common.image")}
                    </Field.Label>
                    <input
                      type="file"
                      accept="image/*"
                      name="cover"
                      style={{ display: "none" }}
                      id="cover"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("cover")?.click()}
                      className="border-color translated-text"
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
export default CreateEvent;
