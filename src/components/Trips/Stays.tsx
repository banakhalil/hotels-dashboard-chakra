import { useAllHotels } from "@/hooks/Trips/usePartnerships";
import {
  Box,
  Card,
  Flex,
  Grid,
  Text,
  Image,
  GridItem,
  HStack,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import DefaultImage from "../../assets/defaultHotel.jpg";
import { IoLocationOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { StaysSkeleton } from "./Skeletons";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useState } from "react";

const Stays = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { data, isLoading, error } = useAllHotels({
    page: currentPage,
    pageSize,
  });
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  // Extract hotels and pagination from the response
  const hotels = data?.hotels || [];
  const pagination = data?.pagination;

  if (isLoading)
    return (
      <Grid templateColumns="repeat(4, 1fr)" gap={6} margin={8}>
        {skeletons.map((skeleton) => (
          <GridItem key={skeleton} borderRadius="2xl">
            <StaysSkeleton key={skeleton} height="300px" />
          </GridItem>
        ))}
      </Grid>
    );

  if (error)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        marginX="auto"
        marginY={6}
        textAlign="center"
      >
        Error loading hotels
      </Text>
    );

  if (!hotels?.length)
    return (
      <Flex
        justify="center"
        align="start"
        h="100%"
        direction="column"
        gap={4}
        marginX={10}
        marginY={6}
        textAlign="center"
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="auto"
          margin="auto"
        >
          No hotels found
        </Text>
      </Flex>
    );

  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6} margin={8}>
        {hotels.map((hotel) => (
          <GridItem key={hotel._id}>
            <Card.Root className="card" display="flex" borderRadius="2xl">
              <Box position="relative" blur="4xl">
                <Image
                  loading="eager"
                  objectFit="cover"
                  borderRadius="2xl"
                  h="300px"
                  w="100%"
                  src={
                    typeof hotel.coverImage === "string"
                      ? hotel.coverImage
                      : hotel.coverImage instanceof File
                      ? URL.createObjectURL(hotel.coverImage)
                      : DefaultImage
                  }
                  alt={DefaultImage}
                />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  height="80px"
                  bgColor="blackAlpha.600"
                  borderBottomRadius="2xl"
                />
                <Text
                  position="absolute"
                  bottom="10"
                  left="4"
                  color="rgb(239, 236, 236)"
                  className="font-oswald"
                  letterSpacing="wide"
                  fontWeight="bold"
                  fontSize="lg"
                  textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                  zIndex={1}
                >
                  {hotel.name}
                </Text>
                <Flex
                  position="absolute"
                  bottom="3"
                  left="4"
                  right="4"
                  justifyContent="space-between"
                  alignItems="center"
                  width="auto"
                  zIndex={1}
                >
                  <HStack gap={2}>
                    <IoLocationOutline color="rgb(239, 236, 236)" />
                    <Text
                      color="rgb(239, 236, 236)"
                      className="font-oswald"
                      letterSpacing="wide"
                      fontSize="sm"
                      textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                    >
                      {hotel.city + ", " + hotel.country}
                    </Text>
                  </HStack>
                  <HStack gap={1}>
                    <FaStar color="rgb(255,192,0)" size="15" />
                    <Text
                      color="rgb(239, 236, 236)"
                      className="font-oswald"
                      letterSpacing="wide"
                      fontSize="md"
                      textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                    >
                      {hotel.stars}
                    </Text>
                  </HStack>
                </Flex>
              </Box>
            </Card.Root>
          </GridItem>
        ))}
      </Grid>

      {/* Pagination */}
      {pagination && (
        <Flex
          justify="center"
          marginY={6}
          position="absolute"
          bottom={0}
          left="50%"
        >
          <ButtonGroup variant="outline" size="sm">
            <IconButton
              disabled={!pagination.hasPreviousPage}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="trip-secondary-button-color"
            >
              <LuChevronLeft />
            </IconButton>

            {/* Page Numbers */}
            {Array.from({ length: pagination.numOfPages }, (_, index) => (
              <IconButton
                bgColor={currentPage === index + 1 ? "#164b9a" : "#bedbffd9"}
                color={
                  currentPage === index + 1 ? "rgb(245, 244, 244)" : "black"
                }
                key={index + 1}
                variant={currentPage === index + 1 ? "solid" : "outline"}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </IconButton>
            ))}

            <IconButton
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="trip-secondary-button-color"
            >
              <LuChevronRight />
            </IconButton>
          </ButtonGroup>
        </Flex>
      )}
    </>
  );
};

export default Stays;
