import {
  Box,
  Circle,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import CardRevenue from "../CardRevenue";
import { SelectedPage } from "@/shared/types";
import {
  useHotelMonthlyTrend,
  useHotelPerformance,
  useHotelStats,
  useHotelStatusDistributions,
  useRoomAvailability,
} from "@/hooks/Hotels/useHotelStats";
import { FaRegCalendarCheck } from "react-icons/fa";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import { GrMoney } from "react-icons/gr";
import { BiHotel } from "react-icons/bi";
import { BarSegment, Chart, useChart } from "@chakra-ui/charts";
import type { BarSegmentData } from "@chakra-ui/charts";
import {
  BarChart,
  Cell,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  PieChart,
  AreaChart,
  Area,
} from "recharts";

type Props = { setSelectedPage: (newPage: SelectedPage) => void };

type RoomType = "Single" | "Double" | "Suite";

interface ChartDataItem extends BarSegmentData {
  category: string;
  name: RoomType;
  value: number;
  color: string;
}

const HotelDashboard = ({ setSelectedPage }: Props) => {
  const { data: stats } = useHotelStats();
  const { data: roomAvailability } = useRoomAvailability();
  const { data: hotelPerformance } = useHotelPerformance();
  const { data: hotelStatusDistributions } = useHotelStatusDistributions();
  const { data: hotelMonthlyTrend } = useHotelMonthlyTrend();

  //stacked bar room availability
  const roomTypes = Object.keys(
    roomAvailability?.roomTypeDistribution || {}
  ) as RoomType[];

  const chartData: ChartDataItem[] = [
    // Available rooms bar segments
    ...roomTypes.map((type) => ({
      category: "Available",
      name: type,
      value: roomAvailability?.roomTypeDistribution[type]?.available ?? 0,
      color:
        type === "Single"
          ? "#a0c5c2"
          : type === "Double"
          ? "#009688"
          : "#00585A",
    })),
    // Occupied rooms bar segments
    ...roomTypes.map((type) => ({
      category: "Occupied",
      name: type,
      value: roomAvailability?.roomTypeDistribution[type]?.occupied ?? 0,
      color:
        type === "Single"
          ? "#a0c5c2"
          : type === "Double"
          ? "#009688"
          : "#00585A",
    })),
  ];

  const availableData = chartData.filter(
    (item) => item.category === "Available"
  );
  const occupiedData = chartData.filter((item) => item.category === "Occupied");

  const availableChart = useChart<BarSegmentData>({
    sort: { by: "value", direction: "desc" },
    data: availableData,
  });

  const occupiedChart = useChart<BarSegmentData>({
    sort: { by: "value", direction: "desc" },
    data: occupiedData,
  });

  const COLORS = [
    "#00585a",
    "#009688",
    "#b2dfdb",
    "#034041",
    "#047f73",
    "#a0c5c2",
  ];
  //pie for hotel performance
  const pieData =
    hotelPerformance?.map((hotel, index) => ({
      name: hotel.hotelName,
      value: hotel.occupancyRate,
      color: COLORS[index % COLORS.length], // Assign color from palette
    })) ?? [];

  const chart = useChart({
    data: pieData,
  });

  //area chart monthly trend
  const monthlyTrendData =
    hotelMonthlyTrend?.map((day, index) => ({
      date: day.month + " " + day.year,
      revenue: day.revenue,
    })) ?? [];

  const monthlyTrendChart = useChart({
    data: monthlyTrendData,
    series: [{ name: "revenue", color: "#009688" }],
  });
  // Transform data for charts
  // const paymentData = Object.entries(
  //   hotelStatusDistributions?.paymentStatus || {}
  // ).map(([name, value]) => ({
  //   name: name
  //     .split("_")
  //     .map((word) => word[0].toUpperCase() + word.slice(1))
  //     .join(" "),
  //   value,
  // }));

  // const bookingData = Object.entries(
  //   hotelStatusDistributions?.bookingStatus || {}
  // ).map(([name, value]) => ({
  //   name: name[0].toUpperCase() + name.slice(1),
  //   value,
  // }));
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
          h="165px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(4, 1fr)"
          gap={4}
        >
          <GridItem colSpan={1}>
            <CardRevenue
              title="Total Bookings"
              value={stats?.totalBookings || "0"}
              percentageChange={0}
              icon={
                <Circle size="50px" className="hotel-sort-button-color">
                  <FaRegCalendarCheck size="22px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Occupancy Rate"
              value={stats?.occupancyRate + " %" || "0"}
              percentageChange={0}
              icon={
                <Circle size="50px" className="hotel-sort-button-color">
                  <BiHotel size="25px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Average Room Price"
              value={"$ " + stats?.averageDailyRate || "0"}
              percentageChange={0}
              icon={
                <Circle size="50px" className="hotel-sort-button-color">
                  <GrMoney size="22px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem rowSpan={2} colSpan={1} height="screen">
            <CardRevenue
              title="Total Revenue"
              value={"$ " + stats?.totalRevenue || "0"}
              percentageChange={0}
              icon={
                <Circle size="50px" className="hotel-sort-button-color">
                  <PiCurrencyCircleDollarBold size="25px" />
                </Circle>
              }
            />
          </GridItem>
        </Grid>
        <Grid
          h="200px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(4, 1fr)"
          gap={4}
        >
          <GridItem colSpan={2}>
            <VStack gap={4}>
              <Box className="card" padding={4} borderRadius="2xl" width="full">
                <Text
                  fontWeight="semibold"
                  fontSize="xl"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  mb={4}
                >
                  Room Availability
                </Text>
                <Text
                  fontWeight="semibold"
                  fontSize="lg"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  mb={2}
                >
                  Available
                </Text>
                <BarSegment.Root chart={availableChart}>
                  <BarSegment.Content>
                    {/* <BarSegment.Value /> */}
                    <BarSegment.Bar
                      tooltip
                      animation="ease-in"
                      animationDuration="1s"
                    />
                    {/* <BarSegment.Label /> */}
                  </BarSegment.Content>
                  {/* <BarSegment.Legend showPercent /> */}
                </BarSegment.Root>
                <Text
                  fontWeight="semibold"
                  fontSize="lg"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  my={2}
                >
                  Occupied
                </Text>
                <BarSegment.Root chart={occupiedChart}>
                  <BarSegment.Content>
                    <BarSegment.Bar tooltip />
                  </BarSegment.Content>
                  <BarSegment.Legend />
                </BarSegment.Root>
              </Box>
              <Box
                className="card"
                gap={2}
                pt={2}
                pb={4}
                pr={4}
                borderRadius="2xl"
                width="full"
              >
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
                    Hotel Occupancy Rates
                  </Text>
                </HStack>
                <Box height="fit-content" px={4} width="100%">
                  <HStack>
                    <Box
                      position="relative"
                      width="250px"
                      height="200px"
                      mx="auto"
                    >
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
                      {/* <Box
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
                        Total Days
                      </Text>
                    </Box> */}
                    </Box>
                    <Box px={8}>
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
                            {item.value}%
                          </Text>
                        </HStack>
                      ))}
                    </Box>
                  </HStack>
                </Box>
              </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={2}>
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
                  Revenue
                </Text>
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
          {/* <GridItem height="screen">
            
          </GridItem> */}
        </Grid>
      </Box>
    </section>
  );
};

export default HotelDashboard;
