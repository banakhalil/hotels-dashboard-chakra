import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  Text,
  Grid,
  GridItem,
  Menu,
  Portal,
  Link,
} from "@chakra-ui/react";
import useHotels, {
  useDeleteHotel,
  useSpecificHotel,
} from "@/hooks/Hotels/useHotels";
import { LuArrowRight, LuCircleCheck } from "react-icons/lu";
import { HiSortAscending } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { Search } from "@/components/Search";
import AllHotelsSkeleton, {
  SpecificHotelSkeleton,
} from "@/components/Hotels/HotelsSkeleton";
import { UpdateHotel } from "./UpdateHotel";
import CreateHotel from "./CreateHotel";
import { toaster } from "../ui/toaster";
import { SelectedPage } from "@/shared/types";
import DefaultImage from "../../assets/defaultHotel.jpg";
import { AxiosError } from "axios";

const items = [
  // { label: "Newest", value: "?sort=-createdAt" },
  // { label: "Oldest", value: "?sort=createdAt" },
  { label: "No Sorting", value: "" },
  { label: "A-Z", value: "?sort=firstName" },
  { label: "Z-A", value: "?sort=-firstName" },
  { label: "Highest Rated", value: "?sort=-stars" },
  { label: "Lowest Rated", value: "?sort=stars" },
];

interface HotelsProps {
  // id: string;
  //  onClick: () => void;
  // isSelected?: boolean;

  onClick: (id: string) => void;
  setSelectedPage: (newPage: SelectedPage) => void;
  isDetailsOpen?: boolean;
  setSelectedHotelId: (id: string | null) => void;
}

interface HotelDetailsProps {
  hotelId: string;
  onClose: () => void;
  setSelectedPage: (newPage: SelectedPage) => void;
  // deleteHotel: (hotelId: string) => Promise<void>;
}
const skeletons = [1, 2, 3, 4, 5, 6];
export const CardHotels = ({
  onClick,
  setSelectedPage,
  isDetailsOpen,
  setSelectedHotelId,
}: HotelsProps) => {
  const [value, setValue] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [hotelIdClicked, setHotelIdClicked] = useState("");
  const { data: hotels, isLoading, error } = useHotels(value, keyWord);
  const flexRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  // Create object URLs when hotels data changes
  useEffect(() => {
    const newUrls: string[] = [];
    hotels?.forEach((hotel) => {
      if (hotel.coverImage instanceof File) {
        newUrls.push(URL.createObjectURL(hotel.coverImage));
      }
    });
    setObjectUrls((prev) => {
      // Cleanup old URLs
      prev.forEach((url) => URL.revokeObjectURL(url));
      return newUrls;
    });
  }, [hotels]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  // Cleanup object URLs when component unmounts or hotels data changes
  useEffect(() => {
    return () => {
      hotels?.forEach((hotel) => {
        if (hotel.coverImage instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(hotel.coverImage));
        }
      });
    };
  }, [hotels]);

  if (error)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        marginX="auto"
        marginY={6}
      >
        Error loading hotels
      </Text>
    );
  if (isLoading)
    return skeletons.map((skeleton) => <AllHotelsSkeleton key={skeleton} />);
  if (!hotels?.length)
    return (
      <>
        <Flex justify="flex-end" mt={8} mb={6} mr={10}>
          <Button
            width="fit-content"
            height={10}
            className="hotel-button-color"
            onClick={() => setIsOpen(true)}
          >
            Add Hotel
          </Button>
          <CreateHotel
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              setHotelIdClicked("");
            }}
          />
        </Flex>
        <Flex
          justify="center"
          align="start"
          h="100%"
          direction="column"
          gap={4}
          marginX={10}
          marginY={6}
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.500"
            marginTop="auto"
            margin="auto"
          >
            No hotel found
          </Text>
          {/* <Button onClick={() => setKeyWord("")}>Clear</Button> */}
        </Flex>
      </>
    );

  return (
    <>
      <Flex
        ref={flexRef}
        direction="column"
        w="full"
        align="center"
        alignItems="center"
        mt={2}
        mb={8}
        gap={4}
        maxH={{ base: "full", lg: "calc(100vh - 10px)" }}
        paddingStart={4}
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
          width={{ base: "sm", lg: "95%" }}
          maxW="95%"
          position="sticky"
          top={0}
          // bg="rgb(245, 244, 244)"
          // _dark={{
          //   bg: "#171717",
          // }}
          bg="rgb(230, 230, 230)"
          _dark={{
            bg: "#222222",
          }}
          transition="background-color 0.1s"
          py={2}
          zIndex={1}
        >
          <Search keyWord={keyWord} setKeyWord={setKeyWord} />
          <HStack>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  width="fit-content"
                  className="hotel-sort-button-color"
                  // bgColor="#a2d5cb"
                  // color="#0b4f4a"
                  height={10}
                >
                  <HiSortAscending /> Sort
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="10rem" className="drawer">
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
              height={10}
              className="hotel-button-color"
              onClick={() => setIsOpen(true)}
            >
              Add Hotel
            </Button>
            <CreateHotel
              isOpen={isOpen}
              onClose={() => {
                setIsOpen(false);
                setHotelIdClicked("");
              }}
            />
          </HStack>
        </HStack>
        {hotels.map((hotel) => (
          <Card.Root
            className="card"
            key={hotel._id as string}
            borderRadius="2xl"
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            overflow="hidden"
            justifyContent="start"
            width={{ base: "sm", md: "95%" }}
            maxW="95%"
            minH={isDetailsOpen ? { md: "fit-content" } : { md: "250px" }}
            onClick={() => {
              onClick(hotel._id as string);
              setHotelIdClicked(hotel._id as string);
            }}
            cursor="pointer"
            borderWidth={2}
            transition="all 0.2s ease"
            _hover={{
              borderColor: "#009688",
              transform: "translateY(-1px)",
              shadow: "lg",
            }}
            borderColor={
              isDetailsOpen && hotelIdClicked === hotel._id
                ? "#009688"
                : "transparent"
            }
          >
            <Image
              loading="eager"
              objectFit="cover"
              borderRadius="xl"
              w={
                isDetailsOpen
                  ? { base: "100%", md: "270px" }
                  : { base: "100%", md: "300px" }
              }
              h={{ base: "200px", md: "auto" }}
              // src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"

              src={
                typeof hotel.coverImage === "string"
                  ? hotel.coverImage
                  : hotel.coverImage instanceof File
                  ? URL.createObjectURL(hotel.coverImage)
                  : DefaultImage
              }
              alt={DefaultImage}
            />

            <Flex
              flex="1"
              direction={
                isDetailsOpen ? { md: "column" } : { base: "column", md: "row" }
              }
              gap={4}
            >
              <Flex flex="1" direction="column" p={{ base: 4, md: 6 }} gap={8}>
                <Box
                  paddingLeft={
                    isDetailsOpen ? { base: 0, md: 0 } : { base: 0, md: 8 }
                  }
                >
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    mb={10}
                  >
                    {hotel.name}
                  </Text>

                  <Text
                    color="gray.700"
                    _dark={{
                      color: "gray.300",
                    }}
                    // className="text-color"
                    fontSize={{ base: "sm", md: "md" }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    display="-webkit-box"
                    style={{
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    mb={4}
                  >
                    {hotel.description}
                  </Text>

                  <Text
                    color="gray.500"
                    fontSize="sm"
                    _dark={{
                      color: "gray.400",
                    }}
                  >
                    In{" "}
                    <Text
                      as="span"
                      color="gray.700"
                      fontWeight="medium"
                      _dark={{
                        color: "gray.300",
                      }}
                    >
                      {hotel.country +
                        ", " +
                        hotel.city +
                        ", " +
                        hotel.location}
                    </Text>
                  </Text>
                </Box>
              </Flex>
              <Flex
                direction={
                  isDetailsOpen ? { md: "row" } : { base: "row", md: "column" }
                }
                gap={4}
                alignItems="center"
                justifyContent={{ base: "space-around", md: "center" }}
                m={8}
              >
                <HStack>
                  {Array.from({ length: hotel.stars }).map((_, index) => (
                    <FaStar
                      key={index}
                      color="rgb(255,192,0)"
                      size={isDetailsOpen ? 15 : 20}
                    />
                  ))}
                </HStack>
                <Button
                  variant="outline"
                  borderWidth="1.5px"
                  size={isDetailsOpen ? "xs" : "sm"}
                  // colorPalette="blue"
                  // color="#D4A373"
                  // borderColor="#D4A373"
                  className="hotel-accent-button"
                  onClick={() => {
                    setSelectedHotelId(hotel._id as string);
                    setSelectedPage(SelectedPage.Rooms);
                    setTimeout(() => {
                      const roomsSection = document.getElementById(
                        SelectedPage.Rooms
                      );
                      if (roomsSection) {
                        roomsSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }, 100);
                  }}
                  asChild
                >
                  <Link href={`#${SelectedPage.Rooms}`}>
                    View rooms <LuArrowRight />
                  </Link>
                </Button>
              </Flex>
            </Flex>
          </Card.Root>
        ))}
      </Flex>
    </>
  );
};
export const CardHotelsDetails = ({ hotelId, onClose }: HotelDetailsProps) => {
  const { data: specificHotel, isLoading, error } = useSpecificHotel(hotelId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutate, isPending } = useDeleteHotel();
  // const [objectUrl, setObjectUrl] = useState<string>("");

  // Create object URL when hotel data changes
  useEffect(() => {
    if (specificHotel?.coverImage instanceof File) {
      const url = URL.createObjectURL(specificHotel.coverImage);
      // setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [specificHotel]);

  if (error)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={20}
      >
        Error loading hotel
      </Text>
    );
  if (isLoading) return <SpecificHotelSkeleton />;
  if (!specificHotel)
    return skeletons.map((skeleton) => <AllHotelsSkeleton key={skeleton} />);

  return (
    <Card.Root
      className="card"
      zIndex={2}
      overflowY={{ base: "visible", lg: "auto" }}
      maxH={{ base: "full", lg: "calc(100vh - 10px)" }}
      flexDirection="column"
      minW="sm"
      overflow="hidden"
      height="fit-content"
      borderRadius="2xl"
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
            onClick={() => setIsEditOpen(true)}
            className="hotel-button-color"
          >
            Edit
          </Button>
          <UpdateHotel
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
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
        loading="eager"
        objectFit="cover"
        borderRadius="xl"
        w="100%"
        h={{ base: "280px", md: "350px" }}
        src={
          // typeof specificHotel.coverImage === "string"
          //   ? specificHotel.coverImage
          //   : objectUrl
          typeof specificHotel.coverImage === "string"
            ? specificHotel.coverImage
            : specificHotel.coverImage instanceof File
            ? URL.createObjectURL(specificHotel.coverImage)
            : DefaultImage
        }
        // src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt={DefaultImage}
      />
      <Card.Body gap="2">
        <Text fontSize="md">Located in:</Text>
        <Text fontWeight="bold" fontSize="lg">
          {specificHotel.country +
            ", " +
            specificHotel.city +
            ", " +
            specificHotel.location}
        </Text>
        <Card.Description fontSize="md">
          {specificHotel.description}
        </Card.Description>
        {/* {specificHotel.rooms.length ? (
          <>
            <Text
              textStyle="lg"
              fontWeight="medium"
              letterSpacing="tight"
              mt="2"
            >
              Rooms
            </Text>
            <Grid templateColumns="repeat(2,1fr)">
              <HStack my={2}>
                {specificHotel.rooms.map((room: RoomData) => (
                  <GridItem key={room._id} colSpan={1}>
                    <Text>{room.roomType}</Text>
                  </GridItem>
                ))}
              </HStack>
            </Grid>
          </>
        ) : null} */}

        <Text
          fontSize="lg"
          textStyle="lg"
          fontWeight="medium"
          letterSpacing="tight"
          mt="2"
        >
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
                      error instanceof AxiosError
                        ? error.response?.data.errors
                            .map((err: any) => err.msg)
                            .join(`  ////  `)
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
