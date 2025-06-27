import { Flex, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

const AllHotelsSkeleton = () => {
  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      gap="6"
      width="full"
      margin={6}
    >
      <Skeleton
        height="200px"
        width="400px"
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
      <SkeletonText
        noOfLines={2}
        mt={4}
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
    </Flex>
  );
};

export default AllHotelsSkeleton;

export const SpecificHotelSkeleton = () => {
  return (
    <VStack gap="6" height="full" mt={16}>
      <Skeleton
        height="300px"
        width="400px"
        mb={8}
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
      <SkeletonText
        noOfLines={3}
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
    </VStack>
  );
};
export const RoomsSkeleton = () => {
  return (
    <VStack gap="6" maxW="xs" marginX="auto">
      <Skeleton
        height="400px"
        width="300px"
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
      <SkeletonText
        noOfLines={2}
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
    </VStack>
  );
};
