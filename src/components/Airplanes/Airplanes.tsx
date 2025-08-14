import { useState, useRef } from "react";
// import { SelectedPage } from "@/shared/types";
import useAirplanes from "@/hooks/Airlines/useAirplanes";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Text,
  Container,
} from "@chakra-ui/react";
import UpdateAirplane from "./UpdateAirplane";
import CreateAirplane from "./CreateAirplane";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// type Props = {
//   setSelectedPage: (newPage: SelectedPage) => void;
// };

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
      className="airplane-secondary-button-color"
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
      className="airplane-secondary-button-color"
    >
      <ArrowLeft size={20} />
    </Button>
  );
}

const Airplanes = () => {
  const { data: airplanes, isLoading, error } = useAirplanes();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAirplaneId, setSelectedAirplaneId] = useState<string>("");
  const sliderRef = useRef<Slider | null>(null);

  // Slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    rows: 2,
    slidesPerRow: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          rows: 2,
          slidesPerRow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          rows: 1,
          slidesPerRow: 1,
        },
      },
    ],
  };

  if (error) {
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        marginX="auto"
        marginY={6}
      >
        Error loading airplanes
      </Text>
    );
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HStack justifyContent="space-between" marginX={16} marginY={4}>
        <Box width="30%"></Box>
        <Button
          className="airline-button-color"
          onClick={() => {
            setIsAddOpen(true);
          }}
        >
          Add Plane
        </Button>
      </HStack>
      <Container maxW="7xl" px={{ base: 4, md: 8 }} py={6}>
        <Box position="relative" mx={{ base: 4, md: 8 }}>
          <Slider ref={sliderRef} {...settings}>
            {airplanes?.map((airplane) => (
              <Box key={airplane._id} px={2}>
                <Card.Root
                  borderRadius="2xl"
                  width="full"
                  maxW="420px"
                  height="fit-content"
                  className="card"
                  margin={4}
                  mx="auto"
                >
                  <Card.Header>
                    <HStack justifyContent="space-between">
                      <Card.Title>{airplane.model}</Card.Title>
                      <Badge
                        colorPalette={
                          airplane.status === "availableToFlight"
                            ? "green"
                            : airplane.status === "inFlight"
                            ? "yellow"
                            : "red"
                        }
                      >
                        {airplane.status === "availableToFlight"
                          ? "Available"
                          : airplane.status === "inFlight"
                          ? "In Flight"
                          : "Maintenance"}
                      </Badge>
                    </HStack>
                  </Card.Header>
                  <Card.Body>
                    <Flex align="center" gap={2} mb={2} mx={2}>
                      <Text
                        fontWeight="semibold"
                        // color="gray.700"
                        // _dark={{ color: "gray.300" }}
                      >
                        Registration Number:
                      </Text>
                      <Text
                        color="gray.700"
                        _dark={{ color: "gray.300" }}
                        fontWeight="medium"
                      >
                        {airplane.registrationNumber}
                      </Text>
                    </Flex>

                    <HStack mb={2} mx={2} mr={4} justifyContent="space-between">
                      <Flex align="center" gap={2}>
                        <Text
                          fontWeight="semibold"
                          // color="gray.700"
                          // _dark={{ color: "gray.300" }}
                        >
                          Economy:
                        </Text>
                        <Text
                          color="gray.700"
                          _dark={{ color: "gray.300" }}
                          fontWeight="medium"
                        >
                          {airplane.seatsEconomy}
                        </Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Text
                          fontWeight="semibold"
                          // color="gray.700"
                          // _dark={{ color: "gray.300" }}
                        >
                          Business:
                        </Text>
                        <Text
                          color="gray.700"
                          _dark={{ color: "gray.300" }}
                          fontWeight="medium"
                        >
                          {airplane.seatsBusiness}
                        </Text>
                      </Flex>
                    </HStack>

                    <Flex align="center" gap={2} mb={2} mx={2}>
                      <Text
                        fontWeight="semibold"
                        // color="gray.700"
                        // _dark={{ color: "gray.300" }}
                      >
                        Currently in:
                      </Text>
                      <Text
                        color="gray.700"
                        _dark={{ color: "gray.300" }}
                        fontWeight="medium"
                      >
                        {airplane.currentLocation}
                      </Text>
                    </Flex>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      className="airline-button-color"
                      onClick={() => {
                        setSelectedAirplaneId(airplane._id);
                        setIsUpdateOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    {/* <Button bg="gray">
                      {airplane.status === "availableToFlight"
                        ? "In Maintenance"
                        : "In Service"}
                    </Button> */}
                  </Card.Footer>
                </Card.Root>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
      {isUpdateOpen && (
        <UpdateAirplane
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          planeId={selectedAirplaneId}
        />
      )}
      {isAddOpen && (
        <CreateAirplane
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />
      )}
    </div>
  );
};

export default Airplanes;
