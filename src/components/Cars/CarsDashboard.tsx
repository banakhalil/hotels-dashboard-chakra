import { Box, Grid, GridItem, Text, HStack, Circle } from "@chakra-ui/react";
import CardRevenue from "../CardRevenue";
// import { SelectedPage } from "@/shared/types";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineVerified } from "react-icons/md";
import { IoCarSportOutline } from "react-icons/io5";
import {
  useCarBookingStats,
  useCarStats,
  useTopCarsByDays,
} from "@/hooks/Cars/useCarStats";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Chart, useChart } from "@chakra-ui/charts";

// type Props = { setSelectedPage: (newPage: SelectedPage) => void };

const CarsDashboard = () => {
  const { data: stats } = useCarStats();
  const { data: bookingsStats } = useCarBookingStats();
  const { data: topCarsByDays } = useTopCarsByDays();

  // Transform and aggregate bookingsStats data for the chart
  const brandBookings =
    bookingsStats?.reduce((acc, car) => {
      acc[car.brand] = (acc[car.brand] || 0) + car.bookingsCount;
      return acc;
    }, {} as Record<string, number>) || {};

  // Convert aggregated data to chart format
  const chartData = Object.entries(brandBookings).map(
    ([brand, totalBookings]) => ({
      brand,
      bookings: totalBookings,
    })
  );

  // Sort data by number of bookings (optional)
  chartData.sort((a, b) => b.bookings - a.bookings);

  // Define color palette for pie chart
  const COLORS = ["#4a6b9a", "#82a6d3", "#2d4b73", "#6088bd", "#1a325c"];

  //pie for top cars by days
  const pieData =
    topCarsByDays?.map((car, index) => ({
      name: car.brand + " " + car.model,
      value: car.daysRented,
      color: COLORS[index % COLORS.length], // Assign color from palette
    })) ?? [];

  const chart = useChart({
    data: pieData,
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
              title="Completed Bookings"
              value={stats?.completedBookings.current || "0"}
              percentageChange={stats?.completedBookings.change || 0}
              icon={
                <Circle size="50px" className="car-secondary2-button-color">
                  <MdOutlineVerified size="25px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Current Bookings"
              value={stats?.currentBookings || "0"}
              percentageChange={0}
              icon={
                <Circle size="50px" className="car-secondary2-button-color">
                  <IoCarSportOutline size="28px" />
                </Circle>
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <CardRevenue
              title="Cancelled Bookings"
              value={stats?.cancelledBookings.current || "0"}
              percentageChange={stats?.cancelledBookings.change || 0}
              icon={
                <Circle size="50px" className="car-secondary2-button-color">
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
                <Circle size="50px" className="car-secondary2-button-color">
                  <PiCurrencyCircleDollarBold size="25px" />
                </Circle>
              }
            />
          </GridItem>
        </Grid>

        {/* Main Content Grid */}
        <Grid
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
                  mt={2}
                  mx={10}
                >
                  Car Bookings by Brand
                </Text>
              </HStack>
              <Box height="400px" px={4} my={8}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="brand" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: "Number of Bookings",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="bookings"
                      fill="#4a6b9a"
                      radius={[10, 10, 0, 0]}
                      barSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
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
                  mt={2}
                >
                  Car Bookings by Days
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
                      Total Days
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
        </Grid>
      </Box>
    </section>
  );
};
export default CarsDashboard;
