"use client";

import {
  useAllAirlines,
  useAllOffices,
  useAllRoutes,
} from "@/hooks/Trips/usePartnerships";
import {
  Box,
  Card,
  Flex,
  Grid,
  Text,
  Image,
  GridItem,
  HStack,
  SkeletonText,
  Timeline,
  Container,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CarsImage from "../../assets/cars1.jpg";
import PlanesImage from "../../assets/airplane2.jpg";
import { IoLocationOutline } from "react-icons/io5";
import { StaysSkeleton } from "./Skeletons";

const Transport = () => {
  const sliderRef1 = useRef<Slider | null>(null);
  const sliderRef2 = useRef<Slider | null>(null);
  const sliderRef3 = useRef<Slider | null>(null);

  const {
    data: offices,
    error,
    isLoading,
    fetchNextPage: fetchNextOffices,
    isFetchingNextPage: isFetchingNextOffices,
    hasNextPage: hasNextOffices,
  } = useAllOffices({ pageSize: 10 });

  const {
    data: routes,
    error: routesError,
    isLoading: routesLoading,
    fetchNextPage: fetchNextRoutes,
    isFetchingNextPage: isFetchingNextRoutes,
    hasNextPage: hasNextRoutes,
  } = useAllRoutes({ pageSize: 10 });

  const {
    data: airlines,
    error: airlinesError,
    isLoading: airlinesLoading,
    fetchNextPage: fetchNextAirlines,
    isFetchingNextPage: isFetchingNextAirlines,
    hasNextPage: hasNextAirlines,
  } = useAllAirlines({ pageSize: 10 });

  const allOffices = offices?.pages.flatMap((page: any) => page.offices) || [];
  const allRoutes = routes?.pages.flatMap((page: any) => page.routes) || [];
  const allAirlines =
    airlines?.pages.flatMap((page: any) => page.airlines) || [];

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
        boxShadow="md"
        onClick={onClick}
        size="sm"
        variant="solid"
        rounded="full"
        minW="40px"
        h="40px"
        className="trip-secondary-button-color"
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
        boxShadow="md"
        onClick={onClick}
        size="sm"
        variant="solid"
        rounded="full"
        minW="40px"
        h="40px"
        className="trip-secondary-button-color"
      >
        <ArrowLeft size={20} />
      </Button>
    );
  }

  const skeletons = [1, 2, 3];

  if (isLoading || airlinesLoading || routesLoading)
    return (
      <>
        <SkeletonText
          noOfLines={1}
          margin={8}
          width="300px"
          bgColor="gray.300"
          _dark={{ bgColor: "gray.800" }}
        />
        <Grid templateColumns="repeat(3, 1fr)" gap={6} margin={8}>
          {skeletons.map((skeleton) => (
            <GridItem key={skeleton} borderRadius="2xl">
              <StaysSkeleton key={skeleton} height="300px" />
            </GridItem>
          ))}
        </Grid>
        <SkeletonText
          noOfLines={1}
          margin={8}
          width="300px"
          bgColor="gray.300"
          _dark={{ bgColor: "gray.800" }}
        />
        <Grid templateColumns="repeat(3, 1fr)" gap={6} margin={8}>
          {skeletons.map((skeleton) => (
            <GridItem key={skeleton} borderRadius="2xl">
              <StaysSkeleton key={skeleton} height="300px" />
            </GridItem>
          ))}
        </Grid>
      </>
    );

  if (error || airlinesError || routesError)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        marginX="auto"
        marginY={6}
      >
        Error loading data
      </Text>
    );

  if (!allOffices.length && !allAirlines.length && !allRoutes.length)
    return (
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
          No data found
        </Text>
      </Flex>
    );

  return (
    <>
      {/* Car Rental Offices Section */}
      <Text
        fontSize="2xl"
        fontWeight="bold"
        margin={8}
        pl={16}
        className="font-oswald"
        letterSpacing="wide"
      >
        Car Rental Offices
      </Text>
      <Container
        maxW="6xl"
        px={{ base: 4, md: 0 }}
        py={6}
        className="font-oswald"
        letterSpacing="wide"
      >
        <Box position="relative" mx={{ base: 4, md: 8 }}>
          <Slider
            ref={sliderRef1}
            {...settings}
            beforeChange={(next: number) => {
              if (
                next >= allOffices.length - 2 &&
                hasNextOffices &&
                !isFetchingNextOffices
              ) {
                fetchNextOffices();
              }
            }}
          >
            {allOffices.map((office: any) => (
              <Box key={office._id} px={2}>
                <Card.Root className="card" display="flex" borderRadius="2xl">
                  <Box position="relative" blur="4xl">
                    <Image
                      loading="eager"
                      objectFit="cover"
                      borderRadius="2xl"
                      h="300px"
                      w="100%"
                      src={
                        typeof office.coverImage === "string"
                          ? office.coverImage
                          : office.coverImage instanceof File
                          ? URL.createObjectURL(office.coverImage)
                          : CarsImage
                      }
                      alt={CarsImage}
                    />
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      right="0"
                      height="80px"
                      bgColor="blackAlpha.700"
                      borderBottomRadius="2xl"
                    />
                    <Text
                      position="absolute"
                      bottom="10"
                      left="4"
                      color="rgb(239, 236, 236)"
                      fontWeight="bold"
                      fontSize="lg"
                      textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                      zIndex={1}
                    >
                      {office.name}
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
                          fontSize="sm"
                          textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                        >
                          {office.city + ", " + office.country}
                        </Text>
                      </HStack>
                      <HStack gap={1}>
                        <Text
                          color="rgb(239, 236, 236)"
                          fontSize="md"
                          textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                        >
                          {office.phone}
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                </Card.Root>
              </Box>
            ))}
            {isFetchingNextOffices && (
              <Box
                width="full"
                height="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StaysSkeleton height="300px" />
              </Box>
            )}
          </Slider>
        </Box>
      </Container>

      {/* Airlines Section */}
      <Text
        fontSize="2xl"
        fontWeight="bold"
        margin={8}
        pl={16}
        className="font-oswald"
        letterSpacing="wide"
      >
        Airlines
      </Text>
      <Container
        maxW="6xl"
        px={{ base: 4, md: 0 }}
        py={6}
        className="font-oswald"
        letterSpacing="wide"
      >
        <Box position="relative" mx={{ base: 4, md: 8 }}>
          <Slider
            ref={sliderRef2}
            {...settings}
            beforeChange={(next: number) => {
              if (
                next >= allAirlines.length - 2 &&
                hasNextAirlines &&
                !isFetchingNextAirlines
              ) {
                fetchNextAirlines();
              }
            }}
          >
            {allAirlines.map((airline: any) => (
              <Box key={airline._id} px={2}>
                <Card.Root className="card" display="flex" borderRadius="2xl">
                  <Box position="relative" blur="4xl">
                    <Image
                      loading="eager"
                      objectFit="cover"
                      borderRadius="2xl"
                      h="300px"
                      w="100%"
                      src={
                        airline.logo
                          ? typeof airline.logo === "string"
                            ? airline.logo
                            : airline.logo instanceof File
                            ? URL.createObjectURL(airline.logo)
                            : PlanesImage
                          : PlanesImage
                      }
                      alt={`${airline.name} logo`}
                    />
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      right="0"
                      height="80px"
                      bgColor="blackAlpha.700"
                      borderBottomRadius="2xl"
                    />
                    <Text
                      position="absolute"
                      bottom="10"
                      left="4"
                      color="rgb(239, 236, 236)"
                      fontWeight="bold"
                      fontSize="lg"
                      textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                      zIndex={1}
                    >
                      {airline.name}
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
                          fontSize="sm"
                          textShadow="0px 0px 8px rgba(0,0,0,0.6)"
                        >
                          {airline.country}
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                </Card.Root>
              </Box>
            ))}
            {isFetchingNextAirlines && (
              <Box
                width="full"
                height="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StaysSkeleton height="300px" />
              </Box>
            )}
          </Slider>
        </Box>
      </Container>

      {/* Routes Section */}
      <Text
        fontSize="2xl"
        fontWeight="bold"
        margin={8}
        pl={16}
        className="font-oswald"
        letterSpacing="wide"
      >
        Train Routes
      </Text>
      <Container
        maxW="6xl"
        px={{ base: 4, md: 0 }}
        py={6}
        className="font-oswald"
        letterSpacing="wide"
      >
        <Box position="relative" mx={{ base: 4, md: 8 }}>
          <Slider
            ref={sliderRef3}
            {...settings}
            beforeChange={(next: number) => {
              if (
                next >= allRoutes.length - 2 &&
                hasNextRoutes &&
                !isFetchingNextRoutes
              ) {
                fetchNextRoutes();
              }
            }}
          >
            {allRoutes.map((route: any) => (
              <Box key={route._id} px={2}>
                <Card.Root className="card" display="flex" borderRadius="2xl">
                  <Card.Body gap="2">
                    <Card.Title mt="2" mb={4} fontSize="xl">
                      {route.name}
                    </Card.Title>
                    {route.stations
                      .filter(
                        (stationItem: any) => stationItem && stationItem.station
                      )
                      .map((stationItem: any, index: number) => (
                        <Timeline.Root size="lg" key={stationItem._id}>
                          <Timeline.Item>
                            <Timeline.Connector>
                              <Timeline.Separator />
                              <Timeline.Indicator className="timeline-color trip-button-color ">
                                {index + 1}
                              </Timeline.Indicator>
                            </Timeline.Connector>
                            <Timeline.Content>
                              <Timeline.Title fontSize="md" fontWeight="normal">
                                {stationItem.station?.name} -{" "}
                                {stationItem.station?.city}
                              </Timeline.Title>
                            </Timeline.Content>
                          </Timeline.Item>
                        </Timeline.Root>
                      ))}
                  </Card.Body>
                </Card.Root>
              </Box>
            ))}
            {isFetchingNextRoutes && (
              <Box
                width="full"
                height="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StaysSkeleton height="300px" />
              </Box>
            )}
          </Slider>
        </Box>
      </Container>
    </>
  );
};

export default Transport;
