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
import { SelectedPage } from "@/shared/types";
import {
  useTrainStats,
  useTrainTicketSalesStats,
  useTrainTripCountStats,
} from "@/hooks/Trains/useTrainStats";
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

type Props = { setSelectedPage: (newPage: SelectedPage) => void };

const TrainDashboard = ({ setSelectedPage }: Props) => {
  const [value, setValue] = useState("");
  const [tripValue, setTripValue] = useState("");
  const { data: stats } = useTrainStats();
  const { data: tickets } = useTrainTicketSalesStats(value);
  const { data: tripCount } = useTrainTripCountStats(tripValue);
  //bar chart
  const ticketData =
    tickets?.labels?.map((day, index) => ({
      type: day,
      tickets: tickets?.data?.[index] ?? 0,
    })) ?? [];

  const chart = useChart({
    data: ticketData,
    series: [{ name: "tickets", color: "#DF440D" }],
  });
  const ticketCollection = [
    { label: "This Week", value: "" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
  ];

  //area chart
  const tripCountData =
    tripCount?.labels?.map((day, index) => ({
      trip: day,
      tripCount: tripCount?.data?.[index] ?? 0,
    })) ?? [];

  const tripCountChart = useChart({
    data: tripCountData,
    series: [{ name: "tripCount", color: "#DF440D" }],
  });
  const tripCollection = [
    { label: "Last 8 Months", value: "" },
    { label: "Last 4 Years", value: "year" },
    // { label: "This Year", value: "year" },
  ];
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
              value={stats?.completedTrips.current || "0"}
              percentageChange={stats?.completedTrips.change || 0}
              icon={
                <Circle size="50px" className="train-secondary-button-color">
                  <MdOutlineVerified size="25px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Active Trips"
              value={stats?.activeTrips || "0"}
              percentageChange={0}
              icon={
                <Circle size="50px" className="train-secondary-button-color">
                  <MdOutlineTrain size="28px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Canceled Trips"
              value={stats?.cancelledTrips.current || "0"}
              percentageChange={stats?.cancelledTrips.change || 0}
              icon={
                <Circle size="50px" className="train-secondary-button-color">
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
                <Circle size="50px" className="train-secondary-button-color">
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
                  Ticket Sales
                </Text>
                <Menu.Root>
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
                      {value === ""
                        ? "This Week"
                        : "This " +
                          value.charAt(0).toUpperCase() +
                          value.slice(1)}
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content minW="10rem" className="drawer">
                        <Menu.RadioItemGroup
                          value={value}
                          onValueChange={(e) => setValue(e.value)}
                        >
                          {ticketCollection.map((item) => (
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
                  {tickets?.totalTickets}
                </Text>
                <Text
                  fontWeight="semibold"
                  fontSize="xs"
                  color="gray.500"
                  _dark={{ color: "gray.400" }}
                  mt={2}
                >
                  Tickets Sold
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
                  />
                  <Tooltip
                    animationDuration={100}
                    content={<Chart.Tooltip />}
                  />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 12]} />
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
                  Trip Schedule
                </Text>
                <Menu.Root>
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
                </Menu.Root>
              </HStack>
              <Chart.Root maxH="md" chart={tripCountChart}>
                <AreaChart
                  accessibilityLayer
                  data={tripCountChart.data}
                  margin={{ bottom: 8, left: 0 }}
                >
                  <XAxis
                    dataKey={tripCountChart.key("trip")}
                    tickMargin={8}
                    // tickFormatter={(value) => value.slice(0, 4)}
                    stroke={tripCountChart.color("gray.300")}
                  />
                  <YAxis stroke={tripCountChart.color("gray.300")} />
                  <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip />}
                  />
                  {tripCountChart.series.map((item) => (
                    <Area
                      type="natural"
                      key={item.name}
                      isAnimationActive={true}
                      dataKey={tripCountChart.key(item.name)}
                      fill={tripCountChart.color(item.color)}
                      fillOpacity={0.2}
                      stroke={tripCountChart.color(item.color)}
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

export default TrainDashboard;
