import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
interface AirlineStats {
  data: {
    stats: {
      completedFlights: {
        current: number;
        previous: number;
        change: number;
        trend: string;
      };
      activeFlights: {
        current: number;
        previous: number;
        change: number;
        trend: string;
      };
      cancelledFlights: {
        current: number;
        previous: number;
        change: number;
        trend: string;
      };
      totalRevenue: {
        current: number;
        previous: number;
        change: number;
        trend: string;
      };
    };
  };
}

interface Booking {
  period: string;
  bookings: number;
}
interface BookingData {
  data: {
    totalBookings: number;
    type: string;
    periodStats: Booking[];
  };
}

interface FlightCount {
  month: string;
  flights: number;
}

interface FlightCountData {
  data: FlightCount[];
}

export const useAirlineStats = () => {
  return useQuery({
    queryKey: ["airlineStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<AirlineStats>(
        "/airlines/myAirline/statistics1"
      );
      return response.data.data.stats;
    },
  });
};

//bar chart
export const useAirlineBookingStats = (type: string) => {
  return useQuery({
    queryKey: ["airlineFlightCount", type],
    queryFn: async () => {
      const url = type
        ? `/airlines/myAirline/statistics3?type=${type}`
        : `/airlines/myAirline/statistics3`;
      const response = await axiosInstance.get<BookingData>(url);
      return response.data.data;
    },
  });
};

//area chart
export const useAirlineFlightCountStats = () => {
  return useQuery({
    queryKey: ["airlineFlightCount"],
    queryFn: async () => {
      const response = await axiosInstance.get<FlightCountData>(
        "/airlines/myAirline/statistics2?year=2025"
      );
      return response.data.data;
    },
  });
};
