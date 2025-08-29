import {
  Box,
  Button,
  Circle,
  Grid,
  GridItem,
  HStack,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";

import CardRevenue from "../CardRevenue";
import { MdOutlineVerified } from "react-icons/md";
import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineTrain } from "react-icons/md";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
("use client");

import { Chart, useChart } from "@chakra-ui/charts";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HiSortAscending } from "react-icons/hi";
import { useState } from "react";
import {
  useAirlineBookingStats,
  useAirlineFlightCountStats,
  useAirlineStats,
} from "@/hooks/Airlines/useAirlineStats";

const AirplaneDashboard = () => {
  const [value, setValue] = useState("");
  const { data: stats } = useAirlineStats();

  const { data: bookings } = useAirlineBookingStats(value);
  const { data: flightCount } = useAirlineFlightCountStats();

  //bar chart
  const bookingData =
    bookings?.periodStats.map((booking) => ({
      type: booking.period,
      bookingsCount: booking.bookings,
    })) ?? [];

  const chart = useChart({
    data: bookingData,
    series: [{ name: "bookingsCount", color: "#616bc6" }],
  });
  const bookingCollection = [
    { label: "This Week", value: "" },
    { label: "This Month", value: "monthly" },
    { label: "This Year", value: "yearly" },
  ];

  //area chart
  const tripCountData =
    flightCount?.map((flight) => ({
      trip: flight.month,
      flightCount: flight.flights,
    })) ?? [];

  const flightCountChart = useChart({
    data: tripCountData,
    series: [{ name: "flightCount", color: "#737fe8" }],
  });
  // const tripCollection = [
  //   { label: "Last 8 Months", value: "" },
  //   { label: "Last 4 Years", value: "year" },
  //   // { label: "This Year", value: "year" },
  // ];
  return (
    <section className="min-h-screen py-6">
      <Box
        pb={32}
        height="full"
        width="full"
        maxW={{ base: "container.sm", lg: "container.xl" }}
        px={{ base: 2, md: 4 }}
      >
        <Grid
          h="200px"
          templateRows="repeat(4, 1fr)"
          templateColumns="repeat(4, 1fr)"
          gap={4}
        >
          <GridItem colSpan={1}>
            <CardRevenue
              title="Completed Trips"
              value={stats?.completedFlights.current || "0"}
              percentageChange={stats?.completedFlights.change || 0}
              icon={
                <Circle size="50px" className="airline-secondary-button-color">
                  <MdOutlineVerified size="25px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Active Trips"
              value={stats?.activeFlights.current || "0"}
              percentageChange={stats?.activeFlights.change || 0}
              icon={
                <Circle size="50px" className="airline-secondary-button-color">
                  <MdOutlineTrain size="28px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Cancelled Trips"
              value={stats?.cancelledFlights.current || "0"}
              percentageChange={stats?.cancelledFlights.change || 0}
              icon={
                <Circle size="50px" className="airline-secondary-button-color">
                  <TbCalendarCancel size="25px" />
                </Circle>
              }
            />
          </GridItem>

          <GridItem colSpan={1}>
            <CardRevenue
              title="Total Revenue"
              value={"$ " + stats?.totalRevenue.current || "0"}
              percentageChange={stats?.totalRevenue.change || 0}
              icon={
                <Circle size="50px" className="airline-secondary-button-color">
                  <PiCurrencyCircleDollarBold size="25px" />
                </Circle>
              }
            />
          </GridItem>
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
                >
                  {" "}
                  Bookings
                </Text>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      width="fit-content"
                      className="airline-secondary-button-color"
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
                          {bookingCollection.map((item) => (
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
              <HStack ml={10} mb={4}>
                <Text
                  fontWeight="semibold"
                  fontSize="2xl"
                  // color="gray.700"
                  // _dark={{ color: "gray.300" }}
                >
                  {" "}
                  {bookings?.totalBookings}
                </Text>
                <Text
                  fontWeight="semibold"
                  fontSize="xs"
                  color="gray.500"
                  _dark={{ color: "gray.400" }}
                  mt={2}
                >
                  Bookings
                </Text>
              </HStack>
              <Chart.Root maxH="md" chart={chart} className="card">
                <BarChart data={chart.data} barSize={40}>
                  <CartesianGrid
                    // stroke={chart.color("border.muted")}
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    tickLine={false}
                    dataKey={chart.key("type")}
                    // interval={0} // Show all ticks
                    angle={-45} // Rotate labels for better fit
                    textAnchor="end" // Align rotated text
                    height={60} // Increase height to accommodate rotated labels
                    tickFormatter={(value) => {
                      if (value.toLowerCase().includes("week")) {
                        return value.split("(")[0].trim();
                      }

                      return value;
                    }}
                  />
                  <Tooltip
                    animationDuration={100}
                    content={<Chart.Tooltip />}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "auto"]}
                  />
                  {chart.series.map((item) => (
                    <Bar
                      key={item.name}
                      isAnimationActive={true}
                      dataKey={chart.key(item.name)}
                      fill={chart.color(item.color)}
                      radius={10}
                    />
                  ))}
                </BarChart>
              </Chart.Root>
            </Box>
          </GridItem>
          <GridItem colSpan={2} rowSpan={4}>
            <Box className="card" gap={2} py={4} pr={4} borderRadius="2xl">
              <HStack justifyContent="space-between" mb={12}>
                <Text
                  fontWeight="semibold"
                  fontSize="xl"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  mb={4}
                  mx={10}
                >
                  {" "}
                  Flight Schedule
                </Text>
                {/* <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      width="fit-content"
                      className="train-secondary-button-color"
                      // bgColor="#a2d5cb"
                      // color="#0b4f4a"
                      height={10}
                    >
                      <HiSortAscending />{" "}
                      {tripValue === "" ? "Last 8 Months" : "Last 4 Years"}
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content minW="10rem" className="drawer">
                        <Menu.RadioItemGroup
                          value={tripValue}
                          onValueChange={(e) => setTripValue(e.value)}
                        >
                          {tripCollection.map((item) => (
                            <Menu.RadioItem key={item.value} value={item.value}>
                              {item.label}
                              <Menu.ItemIndicator />
                            </Menu.RadioItem>
                          ))}
                        </Menu.RadioItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root> */}
              </HStack>
              <Chart.Root maxH="md" chart={flightCountChart}>
                <AreaChart
                  accessibilityLayer
                  data={flightCountChart.data}
                  margin={{ bottom: 8, left: 0 }}
                >
                  <XAxis
                    dataKey={flightCountChart.key("trip")}
                    tickMargin={8}
                    // tickFormatter={(value) => value.slice(0, 4)}
                    stroke={flightCountChart.color("gray.300")}
                    // interval={0} // Show all ticks
                    // angle={-45} // Rotate labels for better fit
                    textAnchor="end" // Align rotated text
                    // height={60} // Increase height to accommodate rotated labels
                  />
                  <YAxis stroke={flightCountChart.color("gray.300")} />
                  <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip />}
                  />
                  {flightCountChart.series.map((item) => (
                    <Area
                      type="natural"
                      key={item.name}
                      isAnimationActive={true}
                      dataKey={flightCountChart.key(item.name)}
                      fill={flightCountChart.color(item.color)}
                      fillOpacity={0.2}
                      stroke={flightCountChart.color(item.color)}
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

export default AirplaneDashboard;
