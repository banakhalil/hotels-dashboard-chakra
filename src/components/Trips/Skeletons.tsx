import { Grid, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

interface Props {
  height: string;
}
export const StaysSkeleton = ({ height }: Props) => {
  return (
    <Skeleton
      borderRadius="2xl"
      height={height}
      width="100%"
      bgColor="gray.300"
      _dark={{ bgColor: "gray.800" }}
    />
  );
};
