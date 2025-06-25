import { useStationsContext } from "@/contexts/StationsContext";
import { Badge, Flex, Table, Text } from "@chakra-ui/react";
import React from "react";

type Props = {};

const allStations = (props: Props) => {
  const { stations, isLoading, error } = useStationsContext();

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
        loading stations
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
        Error loading stations
      </Text>
    );

  if (!stations)
    return (
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.500"
        marginTop="auto"
        margin="auto"
        marginY={6}
      >
        No stations found
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
          mt={10}
        >
          <Table.Root size="lg" stickyHeader>
            <Table.Header>
              <Table.Row
                bg="bg.subtle"
                // bgColor="#b2dfdb"
                // _dark={{ bgColor: "#a0c5c2" }}
                bgColor="#E84F0B"
                _dark={{ bgColor: "#DF440D" }}
              >
                <Table.ColumnHeader color="rgb(239, 236, 236)" width="12.5%">
                  Station
                </Table.ColumnHeader>
                <Table.ColumnHeader color="rgb(239, 236, 236)" width="12.5%">
                  Country
                </Table.ColumnHeader>
                <Table.ColumnHeader color="rgb(239, 236, 236)" width="12.5%">
                  City
                </Table.ColumnHeader>
                <Table.ColumnHeader color="rgb(239, 236, 236)" width="12.5%">
                  Code
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {stations.map((station) => (
                <Table.Row key={station._id} className="card ">
                  <Table.Cell textAlign="start" className="border-color">
                    {station.name}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {station.country}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {station.city}
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {station.code}
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

export default allStations;
