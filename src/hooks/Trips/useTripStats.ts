import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface TripStats {
  data: {
    stats: {
      completedTrips: {
        current: number;
        previous: number;
        change: number;
        trend: string;
      };
      activeTrips: {
        current: number;
        previous: number;
        change: number;
        trend: string;
      };
      cancelledTrips: {
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

interface TopTrips {
  data: {
    topBookedTrips: TripData[];
    totalPassengersInTop4: number;
    totalBookingsInTop4: number;
    totalTripsAnalyzed: number;
  };
}
interface TripData {
  _id: string;
  title: string;
  city: string;
  totalPassengers: number;
  bookingCount: number;
}

interface TripRevenue {
  data: {
    totalRevenue: number;
    type: string;
    periodStats: RevenuePeriodData[];
  };
}

interface RevenuePeriodData {
  period: string;
  revenue: number;
}
export const useTripStats = () => {
  return useQuery({
    queryKey: ["tripStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<TripStats>("/trips/statistics1");
      return response.data.data.stats;
    },
  });
};

export const useTopTripStats = () => {
  return useQuery({
    queryKey: ["topTripStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<TopTrips>("/trips/statistics2");
      return response.data.data;
    },
  });
};
export const useTripRevenueStats = (type?: string) => {
  return useQuery({
    queryKey: ["tripRevenueStats", type],
    queryFn: async () => {
      const url = type
        ? `/trips/statistics3?type=${type}`
        : `/trips/statistics3`;
      const response = await axiosInstance.get<TripRevenue>(url);
      return response.data.data;
    },
  });
};
