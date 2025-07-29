import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Bookings {
  data: {
    bookings: BookingsData[];
  };
}

interface BookingsData {
  _id: string;
  car: {
    _id: string;
    brand: string;
    model: string;
    year: number;
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
}

export const useCarBookings = (officeId: string) => {
  return useQuery({
    queryKey: ["carBookings"],
    queryFn: async () => {
      const response = await axiosInstance.get<Bookings>(
        `/offices/${officeId}/cars/bookings`
      );
      return response.data.data.bookings;
    },
  });
};
