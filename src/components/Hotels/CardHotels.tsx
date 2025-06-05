import React, { useState, useRef, useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  Span,
  Text,
  VStack,
  Grid,
  GridItem,
  Combobox,
  Menu,
  Portal,
} from "@chakra-ui/react";
import useHotels, {
  useAddHotel,
  useDeleteHotel,
  useSpecificHotel,
  useUpdateHotel,
  type RoomData,
} from "@/components/react-query/hooks/useHotels";
import { LuCircleCheck } from "react-icons/lu";
import { HiSortAscending } from "react-icons/hi";
import { Search } from "@/components/Search";
import AllHotelsSkeleton, {
  SpecificHotelSkeleton,
} from "@/components/Hotels/HotelsSkeleton";
import { UpdateHotel } from "./UpdateHotel";
import CreateHotel from "./CreateHotel";
import { toaster } from "../ui/toaster";

const items = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

interface HotelsProps {
  // id: string;
  //  onClick: () => void;
  // isSelected?: boolean;
  onClick: (id: string) => void;
}

interface HotelDetailsProps {
  hotelId: string;
  onClose: () => void;
  // deleteHotel: (hotelId: string) => Promise<void>;
}
const skeletons = [1, 2, 3, 4, 5, 6];
export const CardHotels = ({ onClick }: HotelsProps) => {
  const { data: hotels, isLoading, error } = useHotels();

  const [value, setValue] = useState("asc");
  // const [isScrolled, setIsScrolled] = useState(false);
  const flexRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  // useEffect(() => {
  //   const handleScroll = (e: Event) => {
  //     const target = e.target as HTMLDivElement;
  //     setIsScrolled(target.scrollTop > 10);
  //   };

  //   const flexElement = flexRef.current;
  //   if (flexElement) {
  //     flexElement.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (flexElement) {
  //       flexElement.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  if (error) return <Text fontSize="lg">Error loading hotels</Text>;
  if (isLoading)
    return skeletons.map((skeleton) => <AllHotelsSkeleton key={skeleton} />);
  if (!hotels?.length) return <Text fontSize="lg">No hotel found</Text>;

  return (
    <>
      <Flex
        ref={flexRef}
        direction="column"
        w="full"
        align="center"
        mt={2}
        mb={8}
        gap={4}
        maxH={{ base: "full", lg: "calc(100vh - 10px)" }}
        overflowY={{ base: "visible", lg: "auto" }}
        css={{
          "@media screen and (min-width: 62em)": {
            "&::-webkit-scrollbar": {
              width: "2px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.200",
              borderRadius: "24px",
            },
          },
        }}
      >
        <HStack
          margin="1px"
          flexDirection="row"
          justifyContent="space-between"
          width={{ base: "90%", lg: "95%" }}
          maxW="1200px"
          position="sticky"
          top={0}
          bg="rgb(245, 244, 244)"
          transition="background-color 0.2s"
          py={2}
          zIndex={1}
        >
          <Search />
          <HStack>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm" width="fit-content">
                  <HiSortAscending /> Sort
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem">
                    <Menu.RadioItemGroup
                      value={value}
                      onValueChange={(e) => setValue(e.value)}
                    >
                      {items.map((item) => (
                        <Menu.RadioItem key={item.value} value={item.value}>
                          {item.label}
                          <Menu.ItemIndicator />
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
            <Button
              width="fit-content"
              bgColor="firebrick"
              onClick={() => setIsOpen(true)}
            >
              Add Hotel
            </Button>
            <CreateHotel isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </HStack>
        </HStack>
        {hotels.map((hotel) => (
          <Card.Root
            key={hotel._id as string}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            overflow="hidden"
            justifyContent="start"
            width={{ base: "90%", md: "95%" }}
            maxW="1200px"
            minH={{ base: "auto", md: "200px" }}
            onClick={() => onClick(hotel._id as string)}
            cursor="pointer"
            borderWidth={2}
            borderRadius="lg"
            transition="all 0.2s ease"
            _hover={{
              borderColor: "blue.300",
              transform: "translateY(-1px)",
              shadow: "lg",
            }}
          >
            <Image
              objectFit="cover"
              w={{ base: "100%", md: "300px" }}
              h={{ base: "200px", md: "auto" }}
              // src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              src={hotel.coverImage}
              alt={hotel.name}
            />

            <Flex flex="1" direction="column" p={{ base: 4, md: 6 }} gap={4}>
              <Box>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  mb={2}
                >
                  {hotel.name}
                </Text>
                <Text
                  color="gray.600"
                  fontSize={{ base: "sm", md: "md" }}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  style={{
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {hotel.description}
                </Text>
              </Box>

              <Flex direction="column" gap={3}>
                <Flex wrap="wrap" gap={2}>
                  <Badge colorScheme="blue" px={2} py={1}>
                    {hotel.country}
                  </Badge>
                  <Badge colorScheme="green" px={2} py={1}>
                    {hotel.city}
                  </Badge>
                  <Badge colorScheme="yellow" px={2} py={1}>
                    {hotel.stars} Stars
                  </Badge>
                </Flex>
                <Text color="gray.500" fontSize="sm">
                  Location:{" "}
                  <Text as="span" color="gray.700" fontWeight="medium">
                    {hotel.location}
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </Card.Root>
        ))}
      </Flex>
    </>
  );
};

export const CardHotelsDetails = ({ hotelId, onClose }: HotelDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: specificHotel, isLoading, error } = useSpecificHotel(hotelId);
  const { mutate, isPending } = useDeleteHotel();
  if (error) return <Text fontSize="lg">Error loading hotel</Text>;
  if (isLoading) return <SpecificHotelSkeleton />;
  if (!specificHotel)
    return skeletons.map((skeleton) => <AllHotelsSkeleton key={skeleton} />);

  return (
    <Card.Root
      zIndex={2}
      overflowY={{ base: "visible", lg: "auto" }}
      maxH={{ base: "full", lg: "calc(100vh - 10px)" }}
      flexDirection="column"
      minW="sm"
      overflow="hidden"
      height="fit-content"
      p={4}
      opacity={1}
      mb={8}
      mt={2}
      transform="translateX(0)"
      transition="all 0.3s ease"
      // css={{
      //   "@media screen and (min-width: 62em)": {
      //     "&::-webkit-scrollbar": {
      //       width: "4px",
      //     },
      //     "&::-webkit-scrollbar-track": {
      //       width: "6px",
      //     },
      //     "&::-webkit-scrollbar-thumb": {
      //       background: "gray.200",
      //       borderRadius: "24px",
      //     },
      //   },
      // }}
    >
      <Flex direction="row" justify="space-between" alignItems="center" my={2}>
        <Text fontWeight="bold">Hotel Details</Text>
        <HStack>
          <Button
            width="fit-content"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Edit
          </Button>
          <UpdateHotel
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            hotelId={hotelId}
            name={specificHotel.name}
            country={specificHotel.country}
            city={specificHotel.city}
            location={specificHotel.location}
            description={specificHotel.description}
            amenities={specificHotel.amenities}
            stars={specificHotel.stars}
            coverImage={specificHotel.coverImage}
            images={specificHotel.images}
          />
          <Button width="fit-content" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </HStack>
      </Flex>
      <Card.Title fontSize="2xl" fontWeight="bold" mb={4}>
        {specificHotel.name}
      </Card.Title>
      <Image
        objectFit="cover"
        w={{ base: "100%", md: "auto" }}
        h={{ base: "280px", md: "auto" }}
        src={specificHotel.coverImage}
        // src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt={specificHotel.name}
      />
      <Card.Body gap="2">
        <Text fontSize="sm">Located in:</Text>
        <Text fontWeight="bold" fontSize="md">
          {specificHotel.country + " " + specificHotel.city}
        </Text>
        <Card.Description>{specificHotel.description}</Card.Description>
        {specificHotel.rooms.length ? (
          <Text textStyle="lg" fontWeight="medium" letterSpacing="tight" mt="2">
            Rooms
          </Text>
        ) : null}

        <Grid templateColumns="repeat(2,1fr)">
          <HStack my={2}>
            {specificHotel.rooms.map((room: RoomData) => (
              <GridItem key={room._id} colSpan={1}>
                <Text>{room.roomType}</Text>
              </GridItem>
            ))}
          </HStack>
        </Grid>
        <Text textStyle="lg" fontWeight="medium" letterSpacing="tight" mt="2">
          Amenities
        </Text>
        <Grid templateColumns="repeat(2,1fr)">
          {specificHotel.amenities.map((amenity: string) => (
            <GridItem key={amenity} colSpan={1}>
              <HStack my={2}>
                <LuCircleCheck color="limegreen" />
                <Text>{amenity}</Text>
              </HStack>
            </GridItem>
          ))}
        </Grid>
        {/* <Card.Footer */}
        {/* // display="flex"
          // justifyContent="flex-end"
          // width="full"
          // mt="4"
          flexDirection="row"
          justifyContent="flex-end"
         
        > */}
        <Flex direction="row" justify="end" alignItems="center" my={2}>
          <Button
            width="fit-content"
            colorPalette="red"
            variant="subtle"
            onClick={() =>
              mutate(hotelId, {
                onSuccess: () => {
                  toaster.create({
                    title: "Success",
                    description: "Hotel deleted successfully",
                    type: "success",
                    duration: 3000,
                    closable: true,
                  });
                  onClose();
                },
                onError: (error) => {
                  toaster.create({
                    title: "Error",
                    description:
                      error instanceof Error
                        ? error.message ===
                          "Request failed with status code 400"
                          ? "you don't have permission to delete this hotel"
                          : error.message
                        : "Failed to delete hotel. Please try again.",
                    type: "error",
                    duration: 5000,
                    closable: true,
                  });
                },
              })
            }
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Hotel"}
          </Button>
          {isPending && <AllHotelsSkeleton />}
        </Flex>

        {/* </Card.Footer> */}
      </Card.Body>
    </Card.Root>
  );
};
