import { useState, useRef } from "react";
import {
  Stack,
  VStack,
  useBreakpointValue,
  Portal,
  Box,
} from "@chakra-ui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { CardHotels, CardHotelsDetails } from "./CardHotels";

import { SelectedPage } from "@/shared/types";

interface Props {
  setSelectedPage: (newPage: SelectedPage) => void;
  setSelectedHotelId: (id: string | null) => void;
}

const Hotels = ({ setSelectedPage, setSelectedHotelId }: Props) => {
  const [selectedHotelId, setSelectedHotelIdLocal] = useState<string | null>(
    null
  );
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHotelClick = (hotelId: string) => {
    setSelectedHotelIdLocal(hotelId);
    if (!isMobile && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleClose = () => {
    setSelectedHotelIdLocal(null);
  };

  return (
    <section className="min-h-screen py-6">
      <Box
        ref={containerRef}
        height="full"
        width="full"
        maxW={{ base: "container.sm", lg: "container.xl" }}
        px={{ base: 2, md: 4 }}
      >
        <Stack direction="row" align="start" gap="4">
          <VStack
            align="stretch"
            flex={!isMobile && selectedHotelId ? 1 : "auto"}
            width="full"
            gap={4}
          >
            <CardHotels
              onClick={handleHotelClick}
              setSelectedPage={setSelectedPage}
              isDetailsOpen={!!selectedHotelId}
              setSelectedHotelId={setSelectedHotelId}
            />
          </VStack>

          {!isMobile ? (
            <VStack
              align="stretch"
              flex={selectedHotelId ? 1 : 0}
              width={selectedHotelId ? "auto" : 0}
              minHeight="fit-content"
              opacity={selectedHotelId ? 1 : 0}
              transform={selectedHotelId ? "translateX(0)" : "translateX(100%)"}
              transition="all 0.3s ease"
              position="sticky"
              top="0"
              height="calc(100vh - 2rem)"
              overflowY="auto"
            >
              {selectedHotelId && (
                <CardHotelsDetails
                  hotelId={selectedHotelId}
                  onClose={handleClose}
                  setSelectedPage={setSelectedPage}
                />
              )}
            </VStack>
          ) : (
            selectedHotelId && (
              <Dialog.Root open={true} onOpenChange={() => handleClose()}>
                <Portal>
                  <Dialog.Overlay
                    style={{
                      position: "fixed",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      backdropFilter: "blur(4px)",
                    }}
                  />
                  <Dialog.Title>{selectedHotelId}</Dialog.Title>
                  <Dialog.Description>{selectedHotelId}</Dialog.Description>
                  <Dialog.Content
                    style={{
                      backgroundColor: "white",
                      position: "fixed",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: "100%",
                      maxWidth: "500px",
                      padding: "16px",
                      overflowY: "auto",
                      transform: "translateX(0)",
                      transition: "transform 0.3s ease",
                      zIndex: "2",
                    }}
                  >
                    <CardHotelsDetails
                      hotelId={selectedHotelId}
                      onClose={handleClose}
                      setSelectedPage={setSelectedPage}
                    />
                  </Dialog.Content>
                </Portal>
              </Dialog.Root>
            )
          )}
        </Stack>
      </Box>
    </section>
  );
};
export default Hotels;
