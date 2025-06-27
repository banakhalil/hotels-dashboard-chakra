import { Badge, Flex, Table, Text } from "@chakra-ui/react";
import React from "react";
import useTrains from "@/hooks/useTrains";
import { useTrainsContext } from "@/contexts/TrainsContext";

type Props = {};

const allTrains = (props: Props) => {
  // const { data: trains, isLoading, error } = useTrains();
  const { trains, isLoading, error } = useTrainsContext();

  if (isLoading)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        loading trains
      </Text>
    );

  if (error)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        Error loading trains
      </Text>
    );

  if (!trains)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        No trains found
      </Text>
    );
  return (
    <>
      <Flex
        direction="column"
        w="full"
        align="center"
        alignItems="center"
        mt={2}
        mb={8}
      >
        <Table.ScrollArea
          borderWidth="0.5px"
          rounded="lg"
          height="fit-content"
          w="75%"
          mt={4}
        >
          <Table.Root size="lg" stickyHeader>
            <Table.Header>
              <Table.Row
                bg="bg.subtle"
                bgColor="#E84F0B"
                _dark={{ bgColor: "#DF440D" }}
              >
                <Table.ColumnHeader color="#ffccbc" width="12.5%">
                  Train Name
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#ffccbc" width="12.5%">
                  Speed
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#ffccbc" width="12.5%">
                  Number of Seats
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#ffccbc" width="12.5%">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#ffccbc" width="12.5%">
                  Booked Until
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {trains.map((train) => (
                <Table.Row key={train._id} className="card ">
                  <Table.Cell textAlign="start" className="border-color">
                    {train.name}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {train.speed} km/h
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {train.numberOfSeats}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    <Badge
                      colorPalette={
                        train.status === "booked"
                          ? "yellow"
                          : train.status === "available"
                          ? "green"
                          : train.status === "maintenance"
                          ? "red"
                          : "gray"
                      }
                    >
                      {train.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {train.booked_until
                      ? train.booked_until.substring(0, 10)
                      : "---"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Flex>
    </>
  );
};

export default allTrains;
