import { Flex, Skeleton, VStack } from "@chakra-ui/react";

export const AllTrainsSkeleton = () => {
  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      gap="6"
      width="full"
      margin={6}
      alignItems="center"
      justifyContent="center"
    >
      <Skeleton
        height="200px"
        // width="400px"
        width="90%"
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
    </Flex>
  );
};

export const RoutesSkeleton = () => {
  return (
    <VStack gap="6" maxW="xs" marginX="auto">
      <Skeleton
        height="450px"
        width="350px"
        bgColor="gray.300"
        _dark={{ bgColor: "gray.800" }}
      />
    </VStack>
  );
};
