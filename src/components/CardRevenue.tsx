import { Card, Text, HStack, Icon, Flex } from "@chakra-ui/react";
import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

type Props = {
  title: string;
  value: string | number;
  percentageChange: number;
  bgColor?: string;
  icon?: React.ReactNode;
};

const CardRevenue = ({
  title,
  value,
  percentageChange,
  bgColor = "white",
  icon,
}: Props) => {
  const isPositive = percentageChange >= 1;

  return (
    <Card.Root
      bgColor={bgColor}
      className="card"
      height="150px"
      borderRadius="xl"
    >
      <Card.Body p={4}>
        <Text
          fontWeight="semibold"
          fontSize="sm"
          color="gray.700"
          _dark={{ color: "gray.300" }}
          my={2}
        >
          {title}
        </Text>
        <HStack justifyContent="space-between" mb={2}>
          <Text fontWeight="bold" fontSize="2xl">
            {value}
          </Text>
          {icon && icon}
        </HStack>

        {percentageChange > 0 && (
          <Flex alignItems="center" gap={1}>
            <Icon
              as={isPositive ? FiArrowUpRight : FiArrowDownRight}
              color={isPositive ? "green.500" : "red.500"}
            />

            <Text fontSize="sm" color={isPositive ? "green.500" : "red.500"}>
              {Math.abs(percentageChange / 100)
                .toString()
                .substring(0, 4)}
              %
            </Text>
          </Flex>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default CardRevenue;
