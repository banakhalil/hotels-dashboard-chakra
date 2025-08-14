import { Box, Grid, GridItem, Text, HStack, Card } from "@chakra-ui/react";
import { FiUsers, FiLogIn, FiLogOut, FiDollarSign } from "react-icons/fi";
import CardRevenue from "../CardRevenue";
// import { SelectedPage } from "@/shared/types";

// type Props = { setSelectedPage: (newPage: SelectedPage) => void };

const AirplaneDashboard = () => {
  return (
    <section className="min-h-screen py-6">
      <Box
        height="full"
        width="full"
        maxW={{ base: "container.sm", lg: "container.xl" }}
        px={{ base: 2, md: 4 }}
      >
        {/* <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Dashboard
        </Text> */}

        {/* Top Stats Cards */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
          mb={8}
        >
          <GridItem>
            <CardRevenue
              title="New Bookings"
              value="840"
              percentageChange={8.7}
              icon={<FiUsers size={20} color="gray" />}
            />
          </GridItem>
          <GridItem>
            <CardRevenue
              title="Check-in"
              value="231"
              percentageChange={3.56}
              icon={<FiLogIn size={20} color="gray" />}
            />
          </GridItem>
          <GridItem>
            <CardRevenue
              title="Check-Out"
              value="124"
              percentageChange={-1.06}
              icon={<FiLogOut size={20} color="gray" />}
            />
          </GridItem>
          <GridItem>
            <CardRevenue
              title="Total Revenue"
              value="$123,980"
              percentageChange={5.7}
              icon={<FiDollarSign size={20} color="gray" />}
            />
          </GridItem>
        </Grid>

        {/* Main Content Grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
          templateRows={{ lg: "repeat(6, auto)" }}
          gap={4}
        >
          {/* Room Availability Card */}
          <GridItem colSpan={{ base: 1, lg: 1 }} rowSpan={3}>
            <Card.Root className="dashboard-card" height="full">
              <Card.Body p={4}>
                <HStack justifyContent="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Room Availability
                  </Text>
                  <Text>•••</Text>
                </HStack>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box height={10}></Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Occupied
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      286
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Reserved
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      87
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Available
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      32
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontSize="sm">
                      Not Ready
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      13
                    </Text>
                  </Box>
                </Grid>
              </Card.Body>
            </Card.Root>
          </GridItem>

          {/* Revenue Chart Card */}
          <GridItem colSpan={{ base: 1, lg: 2 }} rowSpan={3}>
            <Card.Root className="dashboard-card" height="full">
              <Card.Body p={4}>
                <HStack justifyContent="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Revenue
                  </Text>
                  <Box
                    as="button"
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="green.50"
                    color="green.700"
                    fontSize="sm"
                  >
                    Last 6 Months
                  </Box>
                </HStack>
                {/* Revenue chart will go here */}
              </Card.Body>
            </Card.Root>
          </GridItem>

          {/* Reservations Chart Card */}
          <GridItem colSpan={{ base: 1, lg: 2 }} rowSpan={3}>
            <Card.Root className="dashboard-card" height="full">
              <Card.Body p={4}>
                <HStack justifyContent="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Reservations
                  </Text>
                  <Box
                    as="button"
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="green.50"
                    color="green.700"
                    fontSize="sm"
                  >
                    Last 7 Days
                  </Box>
                </HStack>
                <Box height={200}></Box>
                {/* Reservations chart will go here */}
              </Card.Body>
            </Card.Root>
          </GridItem>

          {/* Booking Platform Chart Card */}
          <GridItem colSpan={1} rowSpan={3}>
            <Card.Root className="dashboard-card" height="full">
              <Card.Body p={4}>
                <HStack justifyContent="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="semibold">
                    Booking by Platform
                  </Text>
                  <Text>•••</Text>
                </HStack>
                {/* Booking platform chart will go here */}
                <Box height={100}></Box>
              </Card.Body>
            </Card.Root>
          </GridItem>
        </Grid>
      </Box>
    </section>
  );
};

export default AirplaneDashboard;
