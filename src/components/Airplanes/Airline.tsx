import React, { useState } from "react";
import airplane2 from "../../assets/airplane2.jpg";
import { SelectedPage } from "@/shared/types";
import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Skeleton,
  Container,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useAirlinesContext } from "@/contexts/AirlinesContext";
import UpdateAirline from "./UpdateAirline";
import CreateAirline from "./CreateAirline";

type Props = {
  setSelectedPage: (newPage: SelectedPage) => void;
};

const Airline = ({ setSelectedPage }: Props) => {
  const { airline, isLoading, error } = useAirlinesContext();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  // if (error) {
  //   return (
  //     <Text
  //       fontSize="xl"
  //       fontWeight="bold"
  //       color="gray.500"
  //       marginTop="auto"
  //       marginX="auto"
  //       marginY={6}
  //       textAlign="center"
  //     >
  //       Error loading airline
  //     </Text>
  //   );
  // }

  if (isLoading) {
    return (
      <Container maxW="6xl" centerContent py={10}>
        <Flex
          w="full"
          maxW="4xl"
          h="600px"
          bg="white"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="xl"
        >
          <Box flex="1" p={8}>
            <Skeleton
              height="80px"
              width="80px"
              mb={10}
              rounded="2xl"
              mx="auto"
            />
            {/* <Skeleton height="200px" mb={6} /> */}
            <Skeleton height="20px" mb={3} />
            <Skeleton height="20px" mb={3} />
            <Skeleton height="20px" width="60%" />
          </Box>
          <Skeleton flex="1" mx="auto" />
        </Flex>
      </Container>
    );
  }

  if (!airline || !airline._id || !airline.name || error) {
    return (
      <Box m={8}>
        <HStack mx={{ base: 4, md: 8 }} justifyContent="space-between" mb={8}>
          <Box width="30% "></Box>
          <Button
            className="car-button-color"
            onClick={() => setIsAddOpen(true)}
          >
            Add Your Airline
          </Button>
        </HStack>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginX="auto"
          marginY={6}
          textAlign="center"
        >
          No Airline Found
        </Text>
        {isAddOpen && (
          <CreateAirline
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
          />
        )}
      </Box>
    );
  }

  return (
    <Container maxW="6xl" centerContent py={24} minH="100vh">
      <Flex
        w="full"
        maxW="4xl"
        h="500px"
        bg="white"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        backgroundColor="rgb(230, 230, 230)"
        onClick={() => {
          setIsEditOpen(true);
        }}
        cursor="pointer"
        _hover={{
          borderColor: "#2c2875",
          transform: "translateY(-1px)",
          shadow: "lg",
          borderWidth: "2px",
        }}
        _dark={{
          backgroundColor: "#222222",
          _hover: { borderColor: "#a3b3ff", borderWidth: "2px" },
        }}
      >
        {/* Left side - Airline Info */}
        <Box p={8} flex="1" className="card">
          {/* Logo */}
          <Box
            mb={6}
            w="100%"
            h="120px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
          >
            <Image
              src={airline?.logo}
              alt={`${airline?.name} logo`}
              maxH="80%"
              maxW="80%"
              objectFit="contain"
              loading="eager"
              rounded="2xl"
            />
          </Box>

          {/* Airline Info */}
          <Heading as="h1" size="xl" mb={6}>
            {airline?.name}
          </Heading>

          <Text
            fontSize="lg"
            mb={6}
            // color="gray.700"
            // _dark={{ color: "gray.300" }}
            lineHeight="tall"
            fontWeight="medium"
          >
            {airline?.description
              ?.slice(airline?.description.indexOf(":") + 1)
              .trim()}
          </Text>

          <Flex align="center" gap={2} mb={2}>
            <Text
              fontWeight="semibold"
              // color="gray.500"
              // _dark={{ color: "gray.400" }}
            >
              Located in:
            </Text>
            <Text
              color="gray.700"
              _dark={{ color: "gray.300" }}
              fontWeight="medium"
            >
              {airline?.country}
            </Text>
          </Flex>
          <Flex align="center" gap={2} mb={2}>
            <Text
              fontWeight="semibold"
              // color="gray.500"
              // _dark={{ color: "gray.400" }}
            >
              Destination Served:
            </Text>
            <Text
              color="gray.700"
              _dark={{ color: "gray.300" }}
              fontWeight="medium"
            >
              {airline?.destinationCountries}
            </Text>
          </Flex>
          <Flex align="center" gap={2} mb={2}>
            <Text
              fontWeight="semibold"
              // color="gray.500"
              // _dark={{ color: "gray.400" }}
            >
              Planes:
            </Text>
            <Text
              color="gray.700"
              _dark={{ color: "gray.300" }}
              fontWeight="medium"
            >
              {airline?.planesNum}
            </Text>
          </Flex>
        </Box>

        {/* Right side - Airplane Image */}
        <Box
          flex="1"
          p={8}
          backgroundImage={`url(${airplane2})`}
          backgroundSize="cover"
          backgroundPosition="center"
        />
      </Flex>
      {isEditOpen && (
        <UpdateAirline
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </Container>
  );
};

export default Airline;
