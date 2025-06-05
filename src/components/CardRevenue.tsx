import { Card, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  // color
  // text and number and icon and stats
};

const CardRevenue = (props: Props) => {
  return (
    <Card.Root bgColor="red.100">
      <Card.Header />
      <Card.Body>
        <Text fontSize="sm" color="gray.400">
          New Bookings
        </Text>
        <Text fontWeight="bold" fontSize="lg" color="black">
          840
        </Text>
      </Card.Body>
      <Card.Footer />
    </Card.Root>
  );
};

export default CardRevenue;
