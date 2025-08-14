import { useState } from "react";
import cars1 from "../../assets/cars1.jpg";
// import { SelectedPage } from "@/shared/types";
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
import { useOffice } from "@/hooks/Cars/useOffice";
// import { useCars } from "@/hooks/Cars/useCars";
import { UpdateOffice } from "./UpdateOffice";
import CreateOffice from "./CreateOffice";

// type Props = {
//   setSelectedPage: (newPage: SelectedPage) => void;
// };

const Office = () => {
  const { data: officeData, isLoading, error } = useOffice();
  console.log(officeData);
  // const { data: cars } = useCars(officeData?._id || "");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  if (error) {
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
        Error loading office
      </Text>
    );
  }

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

  if (!officeData || !officeData._id || !officeData.name) {
    return (
      <Box m={8}>
        <HStack mx={{ base: 4, md: 8 }} justifyContent="space-between" mb={8}>
          <Box width="30% "></Box>
          <Button
            className="car-button-color"
            onClick={() => setIsAddOpen(true)}
          >
            Add Your Office
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
          No Office Found
        </Text>
        {isAddOpen && (
          <CreateOffice
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
          />
        )}
      </Box>
    );
  }
  //   return <Text>bnbn</Text>;
  return (
    <Container maxW="6xl" centerContent py={24} minH="100vh">
      <Flex
        className="card"
        w="full"
        maxW="4xl"
        h="500px"
        bg="white"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        backgroundColor="rgb(230, 230, 230)"
        cursor="pointer"
        onClick={() => {
          setIsEditOpen(true);
        }}
        _hover={{ borderColor: "#293d5a", borderWidth: "2px" }}
        _dark={{
          _hover: { borderColor: "#a9b3bc", borderWidth: "2px" },
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
              loading="eager"
              src={
                typeof officeData?.coverImage === "string"
                  ? `${officeData.coverImage}?t=${Date.now()}`
                  : officeData?.coverImage instanceof File
                  ? URL.createObjectURL(officeData.coverImage)
                  : ""
              }
              alt={`${officeData?.name} logo`}
              maxH="80%"
              maxW="80%"
              objectFit="contain"
              rounded="2xl"
            />
          </Box>

          {/* office Info */}
          <Heading as="h1" size="xl" mb={6}>
            {officeData?.name}
          </Heading>
          <Flex align="center" gap={2} mb={4}>
            <Text
              fontWeight="semibold"
              // color="gray.500"
              // _dark={{ color: "gray.400" }}
            >
              Based In:
            </Text>
            <Text
              fontWeight="medium"
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              {" " + officeData?.country + ", " + officeData?.city}
            </Text>
          </Flex>

          <Flex align="center" gap={2} mb={4}>
            <Text
              fontWeight="semibold"
              // color="gray.500"
              // _dark={{ color: "gray.400" }}
            >
              Location:
            </Text>
            <Text
              fontWeight="medium"
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              {officeData?.address}
            </Text>
          </Flex>
          <Flex align="center" gap={2} mb={4}>
            <Text
              fontWeight="semibold"
              // color="gray.500"
              // _dark={{ color: "gray.400" }}
            >
              Phone Number:
            </Text>
            <Text
              fontWeight="medium"
              color="gray.700"
              _dark={{ color: "gray.300" }}
            >
              {officeData?.phone}
            </Text>
          </Flex>
          {officeData?.cars !== 0 && (
            <Flex align="center" gap={2} mb={4}>
              <Text
                fontWeight="semibold"
                // color="gray.500"
                // _dark={{ color: "gray.400" }}
              >
                Cars:
              </Text>
              <Text
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                {officeData?.cars + "+ cars"}
              </Text>
            </Flex>
          )}
        </Box>

        {/* Right side - cas Image */}
        <Box
          flex="1"
          p={8}
          backgroundImage={`url(${cars1})`}
          backgroundSize="cover"
          backgroundPosition="center"
        />
      </Flex>
      {isEditOpen && (
        <UpdateOffice
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          officeId={officeData?._id || ""}
          phone={officeData?.phone || ""}
          name={officeData?.name || ""}
          coverImage={officeData?.coverImage || ""}
        />
      )}
    </Container>
  );
};

export default Office;
