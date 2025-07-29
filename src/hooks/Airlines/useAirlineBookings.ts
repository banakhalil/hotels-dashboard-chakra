import axiosInstance from "@/lib/axios";
import { useQrCode } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

interface Flight {
  _id: string;
  departureAirport: {
    name: string;
    iata: string;
    city: string;
    country: string;
  };
  arrivalAirport: {
    name: string;
    iata: string;
    city: string;
    country: string;
  };
  departureDate: string;
}

interface Seats {
  seatNumber: string;
  type: string;
  _id: string;
}

interface Booking {
  _id: string;
  outboundFlight: Flight;
  returnFlight: Flight;
  bookedSeats: Seats[];
  status: string;
  finalPrice: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  paymentStatus: string;
}

interface BookingData {
  data: {
    flightTickets: Booking[];
  };
}

export const useFlightBookings = () => {
  return useQuery({
    queryKey: ["flightBookings"],
    queryFn: async () => {
      const response = await axiosInstance.get<BookingData>(
        "/flightTickets/myTickets"
      );
      return response.data.data.flightTickets;
    },
  });
};
