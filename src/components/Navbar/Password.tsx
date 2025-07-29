import {
  useProfile,
  useUpdatePassword,
  useUpdateProfile,
} from "@/hooks/useProfile";
import {
  Button,
  CloseButton,
  Drawer,
  Field,
  Fieldset,
  Portal,
  Text,
  Input,
} from "@chakra-ui/react";
import React, { useState, type FormEvent } from "react";
import { toaster } from "../ui/toaster";

const getRoleBasedButtonClass = (role: string) => {
  switch (role) {
    case "hotelManager":
      return "hotel-button-color";
    case "routeManager":
      return "train-button-color";
    case "airlineOwner":
      return "airline-button-color";
    case "officeManager":
      return "car-button-color";
    default:
      return "button-color";
  }
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  passwordConfirm?: string;
}

const Password = ({ isOpen, onClose }: Props) => {
  const updatePassword = useUpdatePassword();
  const { data: user, isLoading } = useProfile();
  const [errors, setErrors] = useState<FormErrors>({});
  const buttonColorClass = getRoleBasedButtonClass(user?.role || "");

  const validateForm = (data: {
    currentPassword: string;
    newPassword: string;
    passwordConfirm: string;
  }): boolean => {
    const newErrors: FormErrors = {};

    if (!data.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!data.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (data.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters";
    }

    if (!data.passwordConfirm) {
      newErrors.passwordConfirm = "Please confirm your new password";
    } else if (data.passwordConfirm !== data.newPassword) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      currentPassword: formData.get("currentPassword")?.toString() || "",
      newPassword: formData.get("newPassword")?.toString() || "",
      passwordConfirm: formData.get("passwordConfirm")?.toString() || "",
    };

    if (!validateForm(data)) {
      return;
    }

    updatePassword.mutate(data, {
      onSuccess: () => {
        toaster.create({
          title: "Success",
          description: "Password changed successfully",
          type: "success",
          duration: 3000,
          closable: true,
        });
        form.reset();
        setErrors({});
        onClose();
      },
      onError: (error) => {
        console.error("Error changing password:", error);
        toaster.create({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to change password. Please try again.",
          type: "error",
          duration: 5000,
          closable: true,
        });
      },
    });
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={() => onClose()} size="sm">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header className="drawer">
              <Drawer.Title>Change Password</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="drawer">
              <Fieldset.Root size="lg" maxW="md" marginTop="20px">
                <form onSubmit={handleSubmit}>
                  <Fieldset.Content gap={4}>
                    {isLoading && (
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.500"
                        marginY={6}
                        textAlign="center"
                      >
                        Loading...
                      </Text>
                    )}

                    <Field.Root>
                      <Field.Label>Current Password</Field.Label>
                      <Input
                        name="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                        className="border-color"
                      />
                      {errors.currentPassword && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.currentPassword}
                        </Text>
                      )}
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>New Password</Field.Label>
                      <Input
                        name="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                        className="border-color"
                      />
                      {errors.newPassword && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.newPassword}
                        </Text>
                      )}
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Confirm New Password</Field.Label>
                      <Input
                        name="passwordConfirm"
                        type="password"
                        placeholder="Confirm your new password"
                        className="border-color"
                      />
                      {errors.passwordConfirm && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.passwordConfirm}
                        </Text>
                      )}
                    </Field.Root>
                  </Fieldset.Content>

                  <Button
                    type="submit"
                    my={6}
                    position="absolute"
                    right={6}
                    loading={updatePassword.isPending}
                    className={buttonColorClass}
                  >
                    Change Password
                  </Button>
                </form>
              </Fieldset.Root>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default Password;
