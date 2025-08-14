import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface BookingData {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  hotel: {
    _id: string;
    name: string;
  };
  room: {
    _id: string;
    roomType: string;
    roomNumber: string;
  };
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

interface AllBookings {
  data: {
    bookings: BookingData[];
  };
}

export const useBookings = (value: string, keyWord?: string) => {
  return useQuery<BookingData[]>({
    queryKey: ["bookings", keyWord, value],
    queryFn: async () => {
      const url =
        value && keyWord
          ? `/hotelBookings/manager?keyWord=${keyWord}&${value}`
          : value && !keyWord
          ? `/hotelBookings/manager${value}`
          : keyWord && !value
          ? `/hotelBookings/manager?keyWord=${keyWord}`
          : "/hotelBookings/manager";
      const response = await axiosInstance.get<AllBookings>(url);
      return response.data.data.bookings;
    },
  });
};
