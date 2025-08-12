import React, { useState, useRef } from "react";
import cars1 from "../../assets/cars1.jpg";
import { SelectedPage } from "@/shared/types";
import {
  Box,
  Button,
  Card,
  Image,
  Text,
  Container,
  HStack,
  Badge,
  ColorSwatch,
} from "@chakra-ui/react";
import { useOffice } from "@/hooks/Cars/useOffice";
import { useCars } from "@/hooks/Cars/useCars";
import { useAddCar } from "@/hooks/Cars/useCars";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toaster } from "../ui/toaster";
import { RoomsSkeleton } from "../Hotels/HotelsSkeleton";
import CreateCar from "./CreateCar";
import { UpdateCar } from "./UpdateCar";
import { FaPerson } from "react-icons/fa6";
import { GiGearStickPattern } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
type Props = {
  setSelectedPage: (newPage: SelectedPage) => void;
};
const skeletons = [1, 2, 3];
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
      display={
        props.currentSlide >= props.slideCount - props.slidesToShow
          ? "none"
          : "flex"
      }
      size="sm"
      variant="solid"
      rounded="full"
      minW="40px"
      h="40px"
      className="car-secondary-button-color"
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
      display={props.currentSlide === 0 ? "none" : "flex"}
      size="sm"
      variant="solid"
      rounded="full"
      minW="40px"
      h="40px"
      className="car-secondary-button-color"
    >
      <ArrowLeft size={20} />
    </Button>
  );
}

const Cars = ({ setSelectedPage }: Props) => {
  const { data: officeData, isLoading, error } = useOffice();
  const { data: cars } = useCars(officeData?._id || "");
  const sliderRef = useRef<Slider | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Get the selected car data
  const selectedCar = cars?.find((car) => car._id === selectedCarId);

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
        Error loading cars
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
  if (cars?.length === 0) {
    return (
      <Box m={8}>
        <HStack mx={{ base: 4, md: 8 }} justifyContent="space-between" mb={8}>
          <Box width="30% "></Box>
          <Button
            className="car-button-color"
            onClick={() => setIsAddOpen(true)}
          >
            Add Car
          </Button>
        </HStack>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="auto"
          marginX="auto"
          marginY={6}
          textAlign="center"
        >
          No Cars Found
        </Text>
        {isAddOpen && (
          <CreateCar
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            officeId={officeData?._id || ""}
          />
        )}
      </Box>
    );
  }
  return (
    <Container maxW="7xl" px={{ base: 4, md: 8 }} py={6}>
      <HStack mx={{ base: 4, md: 8 }} justifyContent="space-between" mb={8}>
        <Box width="30% "></Box>
        <Button className="car-button-color" onClick={() => setIsAddOpen(true)}>
          Add Car
        </Button>
      </HStack>
      <Box position="relative" mx={{ base: 4, md: 8 }}>
        <Slider ref={sliderRef} {...settings}>
          {cars?.map((car) => (
            <Box key={car._id} px={2}>
              <Card.Root
                className="card"
                width="full"
                maxW="400px"
                overflow="hidden"
                maxH="700px"
                mx="auto"
                height="full"
              >
                <Image
                  src={
                    car.images && car.images.length > 0
                      ? Array.isArray(car.images) &&
                        typeof car.images[0] === "string"
                        ? car.images[0]
                        : car.images[0] instanceof File
                        ? URL.createObjectURL(car.images[0])
                        : cars1
                      : cars1
                  }
                  alt={`${car.brand} ${car.model}`}
                  objectFit="cover"
                  height="300px"
                  width="100%"
                />
                <Card.Body gap="2">
                  <HStack justifyContent="space-between">
                    <HStack>
                      <Card.Title>{`${car.brand} ${car.model} ${car.year}`}</Card.Title>
                    </HStack>
                    <Badge
                      colorPalette={
                        car.status === "available"
                          ? "green"
                          : car.status === "booked"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {car.status === "available"
                        ? "Available"
                        : car.status === "booked"
                        ? "Booked"
                        : "Maintenance"}
                    </Badge>
                  </HStack>
                  <Card.Description>
                    <HStack justifyContent="space-between" my={2}>
                      <HStack mt={2}>
                        <Text>color: </Text>
                        <ColorSwatch value={car.color} size="sm" />
                      </HStack>
                      <HStack mt={2}>
                        <GiGearStickPattern size="22px" /> {car.gearType}
                      </HStack>
                      <HStack mt={2}>
                        <BsFillFuelPumpFill size="20px" /> {car.fuelType}
                      </HStack>
                    </HStack>
                  </Card.Description>
                  <HStack justifyContent="space-between">
                    <Text
                      textStyle="2xl"
                      fontWeight="medium"
                      letterSpacing="tight"
                    >
                      ${car.pricePerDay}
                      <Text as="span" fontWeight="light" fontSize="sm">
                        /day
                      </Text>
                    </Text>
                    <Text color="gray.700" _dark={{ color: "gray.400" }}>
                      seats: {car.seats}
                    </Text>
                  </HStack>
                </Card.Body>
                <Card.Footer gap="2" justifyContent="flex-end">
                  <Button
                    className="car-button-color"
                    variant="solid"
                    onClick={() => {
                      setSelectedCarId(car._id);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </Card.Footer>
              </Card.Root>
            </Box>
          ))}
        </Slider>
      </Box>
      {isAddOpen && (
        <CreateCar
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          officeId={officeData?._id || ""}
        />
      )}
      {isEditOpen && selectedCar && (
        <UpdateCar
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCarId(null);
          }}
          officeId={officeData?._id || ""}
          carId={selectedCar._id}
          status={selectedCar.status}
          price={selectedCar.pricePerDay}
          images={selectedCar.images}
        />
      )}
    </Container>
  );
};

export default Cars;
