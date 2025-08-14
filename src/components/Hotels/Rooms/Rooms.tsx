import { useDeleteRoom, useRooms } from "@/hooks/Hotels/useHotels";
import { toaster } from "@/components/ui/toaster";
import { SelectedPage } from "@/shared/types";
import {
  Card,
  Image,
  Text,
  Button,
  HStack,
  Box,
  Flex,
  Badge,
  Container,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { GoPeople } from "react-icons/go";
import { IoBedOutline } from "react-icons/io5";
import { LuBedDouble, LuBedSingle, LuCircleCheck } from "react-icons/lu";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { RoomsSkeleton } from "../HotelsSkeleton";
import { UpdateRoom } from "./UpdateRooms";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DefaultImage from "../../../assets/defaultRoom.jpg";

type Props = {
  hotelId: string;
  sortValue: string;
};

const skeletons = [1, 2, 3];

const Rooms = ({ hotelId, sortValue }: Props) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const sliderRef = useRef<Slider | null>(null);

  const {
    data: rooms,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useRooms(hotelId, { pageSize: 10, sortValue: sortValue });

  const { mutate } = useDeleteRoom();

  const allRooms = rooms?.pages.flatMap((page) => page.rooms) || [];
  const lastPage = rooms?.pages[rooms.pages.length - 1];
  const currentPage = lastPage?.pagination?.currentPage || 1;
  const numOfPages = lastPage?.pagination?.numOfPages || 1;
  const hasMorePages = hasNextPage ?? false;

  const selectedRoom = allRooms.find((room) => room._id === selectedRoomId);

  // Slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    beforeChange: ( next: number) => {
      // Load more rooms when reaching near the end
      if (
        next >= allRooms.length - 2 &&
        hasMorePages &&
        !isFetchingNextPage &&
        currentPage < numOfPages
      ) {
        fetchNextPage();
      }
    },
  };

  // Custom arrow components
  function NextArrow(props: any) {
    const { onClick } = props;
    return (
      <Button
        aria-label="Next"
        position="absolute"
        right={-4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
        // bg="white"
        boxShadow="md"
        onClick={onClick}
        display={
          (!hasMorePages && currentPage === numOfPages) ||
          props.currentSlide >= allRooms.length - settings.slidesToShow
            ? "none"
            : "flex"
        }
        size="sm"
        variant="solid"
        rounded="full"
        minW="40px"
        h="40px"
        // color="black"
        className="hotel-sort-button-color"
      >
        <ArrowRight size={20} />
      </Button>
    );
  }

  function PrevArrow(props: any) {
    const { onClick } = props;
    return (
      <Button
        aria-label="Previous"
        position="absolute"
        left={-4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={2}
        // bg="white"
        boxShadow="md"
        onClick={onClick}
        display={props.currentSlide === 0 ? "none" : "flex"}
        size="sm"
        variant="solid"
        rounded="full"
        minW="40px"
        h="40px"
        // color="black"
        className="hotel-sort-button-color"
      >
        <ArrowLeft size={20} />
      </Button>
    );
  }

  if (error)
    return (
      <Text fontSize="lg" textAlign="center">
        Error loading rooms
      </Text>
    );
  if (isLoading)
    return (
      <HStack gap={4} justifyContent="center" alignItems="center" my={20}>
        {skeletons.map((skeleton) => (
          <RoomsSkeleton key={skeleton} />
        ))}
      </HStack>
    );

  if (allRooms.length === 0) {
    return (
      <Box textAlign="center" py={20}>
        <Text
          fontSize="2xl"
          // className="font-oswald"
          color="gray.600"
          _dark={{ color: "gray.400" }}
        >
          No rooms available yet
        </Text>
        <Text
          fontSize="md"
          mt={2}
          color="gray.500"
          _dark={{ color: "gray.500" }}
        >
          Start by adding your first room
        </Text>
      </Box>
    );
  }

  return (
    <>
      <section id={SelectedPage.Rooms}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }} py={6}>
          <Box position="relative" mx={{ base: 4, md: 8 }}>
            <Slider ref={sliderRef} {...settings}>
              {allRooms.map((room) => (
                <Box key={room._id} px={2}>
                  <Card.Root
                    className="card"
                    width="full"
                    maxW="400px"
                    overflow="hidden"
                    maxH="700px"
                    mx="auto"
                    height="full"
                    borderRadius="2xl"
                  >
                    <Image
                      loading="eager"
                      src={
                        typeof room.image === "string"
                          ? room.image
                          : room.image instanceof File
                          ? URL.createObjectURL(room.image)
                          : DefaultImage
                      }
                      alt={DefaultImage}
                      objectFit="cover"
                      height="300px"
                      width="100%"
                    />
                    <Card.Body gap="2">
                      <HStack justifyContent="space-between">
                        <HStack>
                          <Card.Title>
                            {`${room.roomType} ${room.roomNumber} `}
                          </Card.Title>
                          {room.isActive ? null : ( // <SiTicktick color="limegreen" />
                            <HiOutlineWrenchScrewdriver color="red" />
                          )}
                        </HStack>
                        <Badge
                          colorPalette={room.isAvailable ? "green" : "yellow"}
                        >
                          {room.isAvailable ? "Available" : "Occupied"}
                        </Badge>
                      </HStack>
                      <Card.Description>
                        {room.capacity === 1 && (
                          <HStack>
                            <LuBedSingle />
                            <Text paddingRight={4}>Single Bed</Text>
                            <GoPeople />
                            <Text>1 guest</Text>
                          </HStack>
                        )}
                        {room.capacity === 2 && (
                          <HStack>
                            <LuBedDouble />
                            <Text paddingRight={4}>Queen Bed</Text>
                            <GoPeople />
                            <Text>2 guests</Text>
                          </HStack>
                        )}
                        {room.capacity === 3 && (
                          <HStack>
                            <LuBedDouble />
                            <Text paddingRight={4}>King Bed</Text>
                            <GoPeople />
                            <Text>3 guests</Text>
                          </HStack>
                        )}
                        {room.capacity === 4 && (
                          <HStack>
                            <IoBedOutline />
                            <Text paddingRight={4}>2 Queen Beds</Text>
                            <GoPeople />
                            <Text>4 guests</Text>
                          </HStack>
                        )}
                      </Card.Description>
                      <Text
                        textStyle="2xl"
                        fontWeight="medium"
                        letterSpacing="tight"
                        mt="2"
                      >
                        ${room.pricePerNight}
                        <Text as="span" fontWeight="light" fontSize="sm">
                          /night
                        </Text>
                      </Text>
                      <Flex wrap="wrap" gap={2} fontSize="sm">
                        {room.amenities.map((amenity: string) => (
                          <HStack key={amenity} my={2}>
                            <LuCircleCheck color="limegreen" />
                            <Text>{amenity}</Text>
                          </HStack>
                        ))}
                      </Flex>
                    </Card.Body>
                    <Card.Footer gap="2">
                      <Button
                        className="hotel-button-color"
                        variant="solid"
                        onClick={() => {
                          setSelectedRoomId(room._id || "");
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="subtle"
                        colorPalette="red"
                        onClick={() =>
                          mutate(
                            { hotelId, roomId: room._id || "" },
                            {
                              onSuccess: () => {
                                toaster.create({
                                  title: "Success",
                                  description: "Room deleted successfully",
                                  type: "success",
                                  duration: 3000,
                                  closable: true,
                                });
                              },
                              onError: (error) => {
                                toaster.create({
                                  title: "Error",
                                  description:
                                    error instanceof Error
                                      ? error.message
                                      : "Failed to delete room. Please try again.",
                                  type: "error",
                                  duration: 5000,
                                  closable: true,
                                });
                              },
                            }
                          )
                        }
                      >
                        Delete Room
                      </Button>
                    </Card.Footer>
                  </Card.Root>
                </Box>
              ))}
              {isFetchingNextPage && (
                <Box
                  width="full"
                  height="400px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* <Spinner size="xl" /> */}
                  <RoomsSkeleton />
                </Box>
              )}
            </Slider>
          </Box>
        </Container>
      </section>

      {selectedRoom && (
        <UpdateRoom
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedRoomId(null);
          }}
          hotelId={hotelId}
          roomId={selectedRoom._id || ""}
          roomType={selectedRoom.roomType}
          capacity={selectedRoom.capacity}
          pricePerNight={selectedRoom.pricePerNight}
          isAvailable={selectedRoom.isAvailable}
          isActive={selectedRoom.isActive || true}
          amenities={selectedRoom.amenities}
          image={selectedRoom.image}
        />
      )}
    </>
  );
};

export default Rooms;
