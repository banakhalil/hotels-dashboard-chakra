import { Box, Circle, Grid, GridItem, Text } from "@chakra-ui/react";

import CardRevenue from "../CardRevenue";
import { SelectedPage } from "@/shared/types";
import {
  useHotelStats,
  useRoomAvailability,
} from "@/hooks/Hotels/useHotelStats";
import { FaRegCalendarCheck } from "react-icons/fa";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import { GrMoney } from "react-icons/gr";
import { BiHotel } from "react-icons/bi";
import { BarSegment, useChart } from "@chakra-ui/charts";
import type { BarSegmentData } from "@chakra-ui/charts";

type Props = { setSelectedPage: (newPage: SelectedPage) => void };

type RoomType = "Single" | "Double" | "Suite";

type RoomTypeDistribution = {
  [K in RoomType]: {
    total: number;
    available: number;
    occupied: number;
  };
};

interface ChartDataItem extends BarSegmentData {
  category: string;
  name: RoomType;
  value: number;
  color: string;
}

const HotelDashboard = ({ setSelectedPage }: Props) => {
  const { data: stats } = useHotelStats();
  const { data: roomAvailability } = useRoomAvailability();
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
          <GridItem colSpan={2}>
            <Box className="card" padding={4} borderRadius="2xl">
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
                  <BarSegment.Bar tooltip />
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
          </GridItem>
        </Grid>
      </Box>
    </section>
  );
};

export default HotelDashboard;
