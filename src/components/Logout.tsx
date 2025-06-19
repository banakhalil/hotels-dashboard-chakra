import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Logout = ({ isOpen, onClose }: Props) => {
  const { clearToken } = useAuth();

  const handleLogout = () => {
    clearToken(); // This will clear auth data and redirect to login
  };

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header className="drawer">
              {/* <Dialog.Title>Attention</Dialog.Title> */}
            </Dialog.Header>
            <Dialog.Body className="drawer">
              <Text fontSize="md" fontWeight="medium">
                Are you sure you want to log out?
              </Text>
            </Dialog.Body>
            <Dialog.Footer className="drawer">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                variant="solid"
                bgColor="firebrick"
                color="white"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default Logout;
