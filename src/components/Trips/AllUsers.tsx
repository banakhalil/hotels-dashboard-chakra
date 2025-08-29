import {
  Badge,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useCarBookings } from "@/hooks/Cars/useCarBookings";
import { useAllUsers } from "../../hooks/Trips/useGetAllUsers";

const AllUsers = () => {
  const { data: users, isLoading, error } = useAllUsers();
  if (isLoading)
    return (
      // <Text
      //   fontSize="xl"
      //   fontWeight="bold"
      //   color="gray.500"
      //   marginTop="auto"
      //   margin="auto"
      //   marginY={6}
      // >
      //   loading bookings
      // </Text>
      <HStack
        gap={4}
        justifyContent="center"
        alignItems="center"
        my={20}
        mx="100px"
      >
        {
          // skeletons.map((skeleton) => (
          //   <BookingsSkeleton key={skeleton} />
          // ))
          <Skeleton
            variant="pulse"
            // noOfLines={6}
            borderRadius="2xl"
            height="500px"
            width="100%"
            gap="4"
            bgColor="gray.300"
            _dark={{ bgColor: "gray.800" }}
          />
        }
      </HStack>
    );
  if (!users?.length)
    return (
      <Flex
        justify="center"
        align="start"
        h="100%"
        direction="column"
        gap={4}
        marginX={10}
        marginY={10}
      >
        {/* <Search keyWord={keyWord} setKeyWord={setKeyWord} /> */}
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.500"
          marginTop="8px"
          margin="auto"
        >
          No users found
        </Text>
        {/* <Button onClick={() => setKeyWord("")}>Clear</Button> */}
      </Flex>
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
        textAlign="center"
      >
        Error loading users
      </Text>
    );

  return (
    <>
      <Flex
        direction="column"
        w="full"
        align="center"
        alignItems="center"
        my={8}
      >
        <Table.ScrollArea
          borderWidth="0.5px"
          rounded="lg"
          height="fit-content"
          w="65%"
          borderRadius="2xl"
        >
          <Table.Root
            size="lg"
            stickyHeader
            className="font-oswald"
            letterSpacing="wide"
          >
            <Table.Header>
              <Table.Row
                bg="bg.subtle"
                // bgColor="#cad5e2"
                // _dark={{ bgColor: "#a0c5c2" }}
                bgColor="#164b9a"
                _dark={{ bgColor: "#164b9a" }}
              >
                <Table.ColumnHeader color="#bedbff" width="12.5%">
                  User
                </Table.ColumnHeader>
                {/* <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  Email
                </Table.ColumnHeader> */}
                <Table.ColumnHeader color="#bedbff" width="12.5%">
                  Role
                </Table.ColumnHeader>
                {/* <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  Price
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  Payment
                </Table.ColumnHeader>
                <Table.ColumnHeader color="#cad5e2" width="12.5%">
                  Status
                </Table.ColumnHeader> */}
              </Table.Row>
            </Table.Header>

            <Table.Body fontSize="md">
              {users.map((user) => (
                <Table.Row key={user._id} className="card ">
                  <Table.Cell textAlign="start" className="border-color">
                    <Stack>
                      {user.firstName + " " + user.lastName}
                      <Text
                        fontSize="sm"
                        color="gray.700"
                        _dark={{ color: "gray.300" }}
                      >
                        {user.email}
                      </Text>
                    </Stack>
                  </Table.Cell>
                  <Table.Cell textAlign="start" className="border-color">
                    {user.role}
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

export default AllUsers;
