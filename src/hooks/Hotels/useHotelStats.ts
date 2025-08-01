import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface HotelStats {
  data: {
    totalRevenue: number;
    totalBookings: number;
    occupancyRate: number;
    averageDailyRate: number;
    revenuePerAvailableRoom: number;
  };
}

interface RoomAvailability {
  data: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    roomTypeDistribution: {
      Single: {
        total: number;
        available: number;
        occupied: number;
      };
      Double: {
        total: number;
        available: number;
        occupied: number;
      };
      Suite: {
        total: number;
        available: number;
        occupied: number;
      };
    };
  };
}

interface HotelPerformance {
  hotelId: string;
  hotelName: string;
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  totalRooms: number;
  occupancyRate: number;
}

interface MonthlyTrend {
  year: number;
  month: number;
  revenue: number;
  bookings: number;
}

interface MonthlyTrendData {
  data: MonthlyTrend[];
}

interface HotePerformanceData {
  data: HotelPerformance[];
}

interface StatusDistributions {
  data: {
    paymentStatus: {
      pending_payment: number;
      paid: number;
      failed: number;
    };
    bookingStatus: {
      active: number;
      expired: number;
      cancelled: number;
    };
  };
}

//hotel stats
export const useHotelStats = () => {
  return useQuery({
    queryKey: ["hotelStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<HotelStats>(
        "/hotel-statistics/kpis"
      );
      return response.data.data;
    },
  });
};

//room availability / segmented bar chart
export const useRoomAvailability = () => {
  return useQuery({
    queryKey: ["roomAvailability"],
    queryFn: async () => {
      const response = await axiosInstance.get<RoomAvailability>(
        "/hotel-statistics/rooms/availability"
      );
      return response.data.data;
    },
  });
};

//hotel performance // pie chart
export const useHotelPerformance = () => {
  return useQuery({
    queryKey: ["hotelPerformanceStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<HotePerformanceData>(
        "/hotel-statistics/hotels/performance-comparison"
      );
      return response.data.data;
    },
  });
};
//hotel monthly trend // area chart
export const useHotelMonthlyTrend = () => {
  return useQuery({
    queryKey: ["hotelMonthlyTrend"],
    queryFn: async () => {
      const response = await axiosInstance.get<MonthlyTrendData>(
        "/hotel-statistics/revenue/monthly-trend"
      );
      return response.data.data;
    },
  });
};

//hotel status ditributions // idk chart
export const useHotelStatusDistributions = () => {
  return useQuery({
    queryKey: ["hotelStatusDistributions"],
    queryFn: async () => {
      const response = await axiosInstance.get<StatusDistributions>(
        "/hotel-statistics/bookings/status-distribution"
      );
      return response.data.data;
    },
  });
};
