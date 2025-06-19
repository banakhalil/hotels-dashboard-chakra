import {
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  VStack,
} from "@chakra-ui/react";
import React from "react";

interface AllHotelsSkeletonProps {}

const AllHotelsSkeleton = () => {
  return (
    <Flex flexDirection={{ base: "column", md: "row" }} gap="6" width="full">
      <Skeleton height="200px" width="400px" />
      <SkeletonText noOfLines={2} mt={4} />
    </Flex>
  );
};

export default AllHotelsSkeleton;

export const SpecificHotelSkeleton = () => {
  return (
    <VStack gap="6" height="full" mt={16}>
      <Skeleton height="300px" width="400px" mb={8} />
      <SkeletonText noOfLines={3} />
    </VStack>
  );
};
export const RoomsSkeleton = () => {
  return (
    <VStack gap="6" maxW="xs" marginX="auto">
      <Skeleton height="400px" width="300px" />
      <SkeletonText noOfLines={2} />
    </VStack>
  );
};
