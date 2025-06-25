import useRoutes from "@/hooks/useRoutes";
import {
  Avatar,
  Button,
  Card,
  Timeline,
  Text,
  Box,
  Container,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import type { Route } from "@/hooks/useRoutes";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddRoute from "./AddRoute";
import UpdateRoute from "./UpdateRoute";

// Custom arrow components
function NextArrow(props: any) {
  const {
    onClick,
    currentSlide,
    slideCount,
    slidesToShow,
    hasNextPage,
    routes,
  } = props;
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
      display={
        (!hasNextPage && currentSlide >= routes.length - slidesToShow) ||
        currentSlide >= slideCount - slidesToShow
          ? "none"
          : "flex"
      }
      size="sm"
      variant="solid"
      rounded="full"
      minW="40px"
      h="40px"
      className="train-secondary-button-color"
    >
      <ArrowRight size={20} />
    </Button>
  );
}

function PrevArrow(props: any) {
  const { onClick, currentSlide } = props;
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
      display={currentSlide === 0 ? "none" : "flex"}
      size="sm"
      variant="solid"
      rounded="full"
      minW="40px"
      h="40px"
      className="train-secondary-button-color"
    >
      <ArrowLeft size={20} />
    </Button>
  );
}

const AllRoutes = () => {
  const {
    data: routesData,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useRoutes({ pageSize: 50 });

  const sliderRef = useRef<Slider | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const allRoutes = routesData?.pages.flatMap((page) => page.routes) || [];
  const currentPage =
    routesData?.pages[routesData.pages.length - 1]?.pagination.currentPage || 1;
  const numOfPages =
    routesData?.pages[routesData.pages.length - 1]?.pagination.numOfPages || 1;

  console.log(routesData);
  // Slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow hasNextPage={hasNextPage} routes={allRoutes} />,
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
    beforeChange: (current: number, next: number) => {
      // Load more routes when reaching near the end
      if (next >= allRoutes.length - 2 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  };

  if (isLoading)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        loading routes
      </Text>
    );

  if (error)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        Error loading routes
      </Text>
    );

  if (!allRoutes || allRoutes.length === 0)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        No routes found
      </Text>
    );

  return (
    <Container maxW="7xl" px={{ base: 4, md: 8 }} py={6} mt={10}>
      <Flex justify="flex-end" mb={6} mr={10}>
        <Button
          px={4}
          py={2}
          rounded="md"
          onClick={() => setIsOpen(true)}
          className="train-secondary-button-color"
        >
          Add Route
        </Button>
        <AddRoute isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Flex>
      <Box position="relative" mx={{ base: 4, md: 8 }}>
        <Slider ref={sliderRef} {...settings}>
          {allRoutes.map((route: Route) => (
            <Box key={route._id} px={2}>
              <Card.Root
                width="full"
                maxW="400px"
                className="card"
                mx="auto"
                height="400px"
              >
                <Card.Body gap="2">
                  <Card.Title mt="2" mb={4}>
                    {route.name}
                  </Card.Title>
                  {route.stations
                    .filter((stationItem) => stationItem && stationItem.station)
                    .map((stationItem, index) => (
                      <Timeline.Root size="lg" key={stationItem._id}>
                        <Timeline.Item>
                          <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator className="timeline-color ">
                              {index + 1}
                            </Timeline.Indicator>
                          </Timeline.Connector>
                          <Timeline.Content>
                            <Timeline.Title>
                              {stationItem.station?.name} -{" "}
                              {stationItem.station?.city}
                            </Timeline.Title>
                          </Timeline.Content>
                        </Timeline.Item>
                      </Timeline.Root>
                    ))}
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                  <Button
                    className="train-button-color"
                    onClick={() => {
                      setIsEditOpen(true);
                      setSelectedRouteId(route._id);
                    }}
                  >
                    Edit Route
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
              <Spinner size="xl" />
            </Box>
          )}
        </Slider>
      </Box>
      {selectedRouteId && (
        <UpdateRoute
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedRouteId(null);
          }}
          routeId={selectedRouteId || ""}
          routeName={
            allRoutes.find((route) => route._id === selectedRouteId)?.name || ""
          }
          routeStations={
            allRoutes.find((route) => route._id === selectedRouteId)
              ?.stations || []
          }
        />
      )}
    </Container>
  );
};

export default AllRoutes;
