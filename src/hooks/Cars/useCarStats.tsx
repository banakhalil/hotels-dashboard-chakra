import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface CarStats {
  data: {
    completedBookings: {
      current: number;
      previous: number;
      change: number;
      trend: string;
    };
    currentBookings: number;
    cancelledBookings: {
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

interface CarBookingData {
  data: {
    topCarsByBookings: CarBooking[];
  };
}

interface CarBooking {
  bookingsCount: number;
  carId: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
}

interface TopCarData {
  data: {
    topCarsByDays: TopCar[];
  };
}
interface TopCar {
  daysRented: number;
  carId: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
}

//get stats
export const useCarStats = () => {
  return useQuery({
    queryKey: ["carStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<CarStats>(
        "/offices/statistics/counters"
      );
      return response.data.data;
    },
  });
};

// get carBookings by brand// bar chart
export const useCarBookingStats = () => {
  return useQuery({
    queryKey: ["carBookingsStats"],
    queryFn: async () => {
      const response = await axiosInstance.get<CarBookingData>(
        "/offices/statistics/top-rented-cars-by-bookings"
      );
      return response.data.data.topCarsByBookings;
    },
  });
};

// get top cars by days // pie/ angle padding chart
export const useTopCarsByDays = () => {
  return useQuery({
    queryKey: ["topCarsByDays"],
    queryFn: async () => {
      const response = await axiosInstance.get<TopCarData>(
        "/offices/statistics/top-rented-cars-by-days"
      );
      return response.data.data.topCarsByDays;
    },
  });
};
