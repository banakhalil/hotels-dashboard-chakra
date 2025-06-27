import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import {
  Button,
  CloseButton,
  Drawer,
  For,
  NativeSelect,
  Field,
  Fieldset,
  Portal,
  Text,
  Stack,
  Input,
  Image,
  Avatar,
} from "@chakra-ui/react";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { type UserData } from "@/hooks/useProfile";
import { toaster } from "../ui/toaster";
import { HiUpload } from "react-icons/hi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  //   user?: {
  //     _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: File | string;
  //     isVerified: boolean;
  //     active: boolean;
  //   };
}

// type ProfileProps = Props & UserData;
const getRoleBasedButtonClass = (role: string) => {
  switch (role) {
    case "hotelManager":
      return "hotel-button-color";
    case "routeManager":
      return "train-button-color";
    case "airlineOwner":
      return "airline-button-color";
    default:
      return "button-color";
  }
};

const getRoleBasedChangeAvatarClass = (role: string) => {
  switch (role) {
    case "hotelManager":
      return "hotel-change-avatar";
    case "routeManager":
      return "train-change-avatar";
    case "airlineOwner":
      return "airline-change-avatar";
    default:
      return "change-avatar";
  }
};

const Profile = ({
  isOpen,
  onClose,
  firstName,
  lastName,
  email,
  role,
  avatar,
}: Props) => {
  const { data: user, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const buttonColorClass = getRoleBasedButtonClass(role);
  const changeAvatarClass = getRoleBasedChangeAvatarClass(role);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };
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

    // Get the files and log them
    const coverImageInput = document.getElementById(
      "avatar"
    ) as HTMLInputElement;
    const coverImageFile = coverImageInput?.files?.[0];

    console.log("Debug - Cover Image Input:", {
      hasFiles: Boolean(coverImageInput?.files?.length),
      coverImageFile,
      existingCoverImage: avatar,
    });

    // Create the hotel data object first
    const profileData: {
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      avatar: File | string;
    } = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      avatar: coverImageFile || avatar,
    };

    console.log("Debug - Hotel Data Object:", {
      ...profileData,
      coverImageType:
        profileData.avatar instanceof File ? "File" : typeof profileData.avatar,
    });

    // Create a new FormData for sending
    const formDataToSend = new FormData();

    // Append all data to FormData
    Object.entries(profileData).forEach(([key, value]) => {
      if (key === "avatar") {
        if (value instanceof File) {
          console.log("Debug - Appending cover image as File:", value.name);
          formDataToSend.append("avatar", value);
        } else if (typeof value === "string") {
          console.log("Debug - Appending cover image as string:", value);
          formDataToSend.append("avatar", value);
        }
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

    updateProfile.mutate(formDataToSend as any, {
      onSuccess: () => {
        console.log("Profile updated successfully");
        toaster.create({
          title: "Success",
          description: "Profile updated successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        onClose();
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
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
  // if (error)
  //   return (
  //     <Text
  //       fontSize="xl"
  //       fontWeight="bold"
  //       color="gray.500"
  //       marginTop="auto"
  //       margin="auto"
  //       marginY={6}
  //     >
  //       Error loading profile
  //     </Text>
  //   );
  // if (isLoading)
  //   return (
  //     <Text
  //       fontSize="xl"
  //       fontWeight="bold"
  //       color="gray.500"
  //       marginTop="auto"
  //       margin="auto"
  //       marginY={6}
  //     >
  //       loading profile
  //     </Text>
  //   );
  return (
    // <Dialog.Root open={isOpen} onOpenChange={() => onClose()}>
    //   <Portal>
    //     <Dialog.Overlay
    //       style={{
    //         position: "fixed",
    //         inset: 0,
    //         backgroundColor: "rgba(0, 0, 0, 0.5)",
    //         backdropFilter: "blur(4px)",
    //       }}
    //     />
    //     <Dialog.Title>Profile</Dialog.Title>
    //     <Dialog.Description>description</Dialog.Description>
    //     <Dialog.Content
    //       style={{
    //         backgroundColor: "white",
    //         position: "fixed",
    //         right: 0,
    //         top: 0,
    //         bottom: 0,
    //         width: "100%",
    //         maxWidth: "500px",
    //         padding: "16px",
    //         overflowY: "auto",
    //         transform: "translateX(0)",
    //         transition: "transform 0.3s ease",
    //         zIndex: "2",
    //       }}
    //     >
    //       <Text>{user?.firstName}</Text>
    //       <Text>{user?.lastName}</Text>
    //       <Text>{user?.email}</Text>
    //     </Dialog.Content>
    //   </Portal>
    // </Dialog.Root>
    <Drawer.Root open={isOpen} onOpenChange={() => onClose()} size="sm">
      {/* <Drawer.Trigger asChild>
      <Button variant="outline" size="sm">
        Open Drawer
      </Button>
    </Drawer.Trigger> */}
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header className="drawer">
              <Drawer.Title>My Profile</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="drawer">
              <Fieldset.Root size="lg" maxW="md">
                {/* <Stack>
                <Fieldset.Legend>Contact details</Fieldset.Legend>
                <Fieldset.HelperText>
                  Please provide your contact details below.
                </Fieldset.HelperText>
              </Stack> */}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Fieldset.Content>
                    {isLoading && (
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.500"
                        marginTop="auto"
                        margin="auto"
                        marginY={6}
                      >
                        loading profile
                      </Text>
                    )}
                    {error && (
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.500"
                        marginTop="auto"
                        margin="auto"
                        marginY={6}
                      >
                        Error loading profile
                      </Text>
                    )}
                    {/* <Image src="https://bit.ly/sage-adebayo" fit="cover" height="250px" width="250px" borderRadius="full" alignSelf="center" />  */}

                    <Avatar.Root
                      width="250px"
                      height="250px"
                      alignSelf="center"
                    >
                      <Avatar.Fallback
                        name={`${firstName} ${lastName}`}
                        fontSize="2xl"
                      />
                      {imagePreview ? (
                        <Avatar.Image src={imagePreview} />
                      ) : typeof avatar === "string" ? (
                        <Avatar.Image src={avatar} />
                      ) : null}
                    </Avatar.Root>
                    <Field.Root alignItems="center">
                      <input
                        type="file"
                        accept="image/*"
                        name="avatar"
                        style={{ display: "none" }}
                        id="avatar"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className={changeAvatarClass}
                        onClick={() =>
                          document.getElementById("avatar")?.click()
                        }
                      >
                        <HiUpload /> Change Avatar
                      </Button>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>First Name</Field.Label>
                      <Input
                        name="firstName"
                        type="text"
                        ref={firstRef}
                        defaultValue={firstName}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Last Name</Field.Label>
                      <Input
                        name="lastName"
                        type="text"
                        ref={lastRef}
                        defaultValue={lastName}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Email address</Field.Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="email@gmail.com"
                        ref={emailRef}
                        defaultValue={email}
                        className="border-color"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Role</Field.Label>
                      <Input
                        name="firstName"
                        type="text"
                        readOnly
                        value={role}
                        ref={roleRef}
                        className="border-color"
                      />
                    </Field.Root>
                  </Fieldset.Content>

                  <Button
                    type="submit"
                    my={6}
                    position="absolute"
                    right={6}
                    className={buttonColorClass}
                  >
                    Update
                  </Button>
                </form>
              </Fieldset.Root>
            </Drawer.Body>
            {/* <Drawer.Footer>
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </Drawer.Footer> */}

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default Profile;
