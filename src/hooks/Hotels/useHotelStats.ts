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
