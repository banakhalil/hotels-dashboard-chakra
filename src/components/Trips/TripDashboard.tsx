import {
  Box,
  GridItem,
  Grid,
  Circle,
  HStack,
  Text,
  Menu,
  Button,
  Portal,
} from "@chakra-ui/react";
import CardRevenue from "../CardRevenue";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import {
  useTopTripStats,
  useTripRevenueStats,
  useTripStats,
} from "@/hooks/Trips/useTripStats";
import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineVerified } from "react-icons/md";
import { FaGlobeAfrica } from "react-icons/fa";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HiSortAscending } from "react-icons/hi";
import { useState } from "react";

const TripDashboard = () => {
  const [value, setValue] = useState("");
  const { data: tripStats } = useTripStats();
  const { data: topTripStats } = useTopTripStats();
  const { data: tripRevenueStats } = useTripRevenueStats(value);

  // Define color palette for pie chart
  const COLORS = ["#164b9a", "#a5c1e3", "#113d7f", "#5a9ade"];

  //pie for top cars by days
  const pieData =
    topTripStats?.topBookedTrips.map((trip, index) => ({
      name: trip.title + " - " + trip.city,
      value: trip.totalPassengers,
      color: COLORS[index % COLORS.length], // Assign color from palette
    })) ?? [];

  const chart = useChart({
    data: pieData,
  });

  //area chart monthly trend

  const revenueCollection = [
    { label: "This Week", value: "" },
    { label: "This Month", value: "monthly" },
    { label: "This Year", value: "yearly" },
  ];

  const monthlyTrendData =
    tripRevenueStats?.periodStats.map((day) => ({
      date: day.period,
      revenue: day.revenue,
    })) ?? [];

  const monthlyTrendChart = useChart({
    data: monthlyTrendData,
    series: [{ name: "revenue", color: "#5a9ade" }],
  });

  return (
    <section className="min-h-screen py-6">
      <Box
        height="full"
        width="full"
        maxW={{ base: "container.sm", lg: "container.xl" }}
        px={{ base: 2, md: 4 }}
      >
        {/* Top Stats Cards */}
        <Grid
          className="font-oswald"
          letterSpacing="wide"
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
          mb={8}
        >
          <GridItem colSpan={1}>
            <CardRevenue
              title="Completed Trips"
              value={tripStats?.completedTrips.current || "0"}
              percentageChange={tripStats?.completedTrips.change || 0}
              icon={
                <Circle size="50px" className="trip-secondary-button-color">
                  <MdOutlineVerified size="25px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Active Trips"
              value={tripStats?.activeTrips.current || "0"}
              percentageChange={tripStats?.activeTrips.change || 0}
              icon={
                <Circle size="50px" className="trip-secondary-button-color">
                  <FaGlobeAfrica size="22px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Cancelled Trips"
              value={tripStats?.cancelledTrips.current || "0"}
              percentageChange={tripStats?.cancelledTrips.change || 0}
              icon={
                <Circle size="50px" className="trip-secondary-button-color">
                  <TbCalendarCancel size="25px" />
                </Circle>
              }
            />
          </GridItem>

          <GridItem colSpan={1}>
            <CardRevenue
              title="Total Revenue"
              value={"$ " + tripStats?.totalRevenue.current || "0"}
              percentageChange={tripStats?.totalRevenue.change || 0}
              icon={
                <Circle size="50px" className="trip-secondary-button-color">
                  <PiCurrencyCircleDollarBold size="25px" />
                </Circle>
              }
            />
          </GridItem>
        </Grid>

        {/* Main Content Grid */}
        <Grid
          className="font-oswald"
          letterSpacing="wide"
          templateColumns={{ base: "1fr", lg: "repeat(4, 1fr)" }}
          templateRows={{ lg: "repeat(3, auto)" }}
          gap={4}
        >
          <GridItem rowSpan={2} colSpan={2} height="screen">
            <Box className="card" gap={2} py={4} pr={4} borderRadius="2xl">
              <HStack justifyContent="space-between">
                <Text
                  fontWeight="semibold"
                  fontSize="xl"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  mb={4}
                  mx={10}
                  mt={2}
                >
                  Top Trips
                </Text>
              </HStack>
              <Box height="400px" px={4} my={8}>
                <Box position="relative" width="200px" height="200px" mx="auto">
                  <Chart.Root
                    boxSize="200px"
                    chart={chart}
                    mx="auto"
                    border="transparent"
                    bg="transparent"
                  >
                    <PieChart style={{ backgroundColor: "transparent" }}>
                      <Tooltip
                        cursor={false}
                        animationDuration={100}
                        content={<Chart.Tooltip hideLabel />}
                      />
                      <Pie
                        innerRadius={80}
                        outerRadius={100}
                        isAnimationActive={true}
                        data={chart.data}
                        dataKey={chart.key("value")}
                        paddingAngle={8}
                        cornerRadius={4}
                        label={false}
                        stroke="none"
                      >
                        {chart.data.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </Chart.Root>
                  {/* Center Text */}
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    textAlign="center"
                    zIndex={1}
                  >
                    <Text fontSize="xl" fontWeight="bold">
                      {chart.data.reduce((sum, item) => sum + item.value, 0)}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      Total Participants
                    </Text>
                  </Box>
                </Box>
                {/* Legend */}
                <Box mt={12} px={8}>
                  {chart.data.map((item) => (
                    <HStack key={item.name} mb={2} gap={3}>
                      <Box
                        w="12px"
                        h="12px"
                        borderRadius="sm"
                        bg={item.color}
                      />
                      <Text
                        fontSize="medium"
                        fontWeight="medium"
                        color="gray.700"
                        _dark={{ color: "gray.300" }}
                      >
                        {item.name}
                      </Text>
                      <Text fontSize="medium" fontWeight="bold" ml="auto">
                        {item.value}
                      </Text>
                    </HStack>
                  ))}
                </Box>
              </Box>
            </Box>
          </GridItem>
          <GridItem colSpan={2}>
            <Box className="card" gap={2} py={4} pr={4} borderRadius="2xl">
              <HStack justifyContent="space-between" mb={10}>
                <Text
                  fontWeight="semibold"
                  fontSize="xl"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  // mb={4}
                  mx={10}
                  // mt={2}
                >
                  {" "}
                  Revenue
                </Text>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      width="fit-content"
                      className="trip-secondary-button-color"
                      // bgColor="#a2d5cb"
                      // color="#0b4f4a"
                      height={10}
                    >
                      <HiSortAscending />{" "}
                      {value === ""
                        ? "This Week"
                        : value === "monthly"
                        ? "This Month"
                        : "This Year"}
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content minW="10rem" className="drawer">
                        <Menu.RadioItemGroup
                          value={value}
                          onValueChange={(e) => setValue(e.value)}
                        >
                          {revenueCollection.map((item) => (
                            <Menu.RadioItem key={item.value} value={item.value}>
                              {item.label}
                              <Menu.ItemIndicator />
                            </Menu.RadioItem>
                          ))}
                        </Menu.RadioItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </HStack>
              <Chart.Root maxH="md" chart={monthlyTrendChart}>
                <AreaChart
                  accessibilityLayer
                  data={monthlyTrendChart.data}
                  margin={{ bottom: 8, left: 0 }}
                >
                  <XAxis
                    dataKey={monthlyTrendChart.key("date")}
                    tickMargin={8}
                    // tickFormatter={(value) => value.slice(0, 4)}
                    tickFormatter={(value) => {
                      if (value.toLowerCase().includes("week")) {
                        return value.split("(")[0].trim();
                      }

                      return value;
                    }}
                    stroke={monthlyTrendChart.color("gray.300")}
                  />
                  <YAxis stroke={monthlyTrendChart.color("gray.300")} />
                  <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip />}
                  />
                  {monthlyTrendChart.series.map((item) => (
                    <Area
                      type="natural"
                      key={item.name}
                      isAnimationActive={true}
                      dataKey={monthlyTrendChart.key(item.name)}
                      fill={monthlyTrendChart.color(item.color)}
                      fillOpacity={0.2}
                      stroke={monthlyTrendChart.color(item.color)}
                      stackId="a"
                    />
                  ))}
                </AreaChart>
              </Chart.Root>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </section>
  );
};

export default TripDashboard;
