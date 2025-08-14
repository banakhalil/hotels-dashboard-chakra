import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface TrainStats {
  data: {
    completedTrips: {
      current: number;
      previous: number;
      change: number;
      trend: string;
    };
    activeTrips: number;
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
}

interface TripTicketSalesStats {
  period: string;
  totalTickets: number;
  labels: string[];
  data: number[];
}

// interface TripTripCountStats {
//   periodType: string;
//   totalTickets: number;
//   labels: string[];
//   data: number[];
// }

//get stats
export const useTrainStats = () => {
  return useQuery({
    queryKey: ["trainStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<TrainStats>(
        "/train-trips/statistics/counters"
      );
      return response.data.data;
    },
  });
};

//get ticket sales /  bar chart
export const useTrainTicketSalesStats = (period?: string) => {
  return useQuery({
    queryKey: ["trainTicketSalesStats", period],
    queryFn: async () => {
      const url = period
        ? `/train-trips/statistics/ticket-sales?period=${period}`
        : `/train-trips/statistics/ticket-sales`;
      const response = await axiosInstance.get<TripTicketSalesStats>(url);
      return response.data;
    },
  });
};

//get trip count /  area chart
export const useTrainTripCountStats = (
  period?: string,
  periodCount?: string
) => {
  return useQuery({
    queryKey: ["trainTripCountStats", period, periodCount],
    queryFn: async () => {
      if (period) {
        periodCount = "4";
      }
      const url =
        // period && !periodCount
        //   ? `/train-trips/statistics/trip-counts?periodType=${period}`
        //   :
        period && periodCount
          ? `/train-trips/statistics/trip-counts?periodType=${period}&periodCount=${periodCount}`
          : // : !period && periodCount
            // ? `/train-trips/statistics/trip-counts?periodCount=${periodCount}`

            `/train-trips/statistics/trip-counts`;
      const response = await axiosInstance.get<TripTicketSalesStats>(url);
      return response.data;
    },
  });
};
