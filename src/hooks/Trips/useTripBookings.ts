import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type AllTransportData = TrainData & CarData & AirlineData;

interface booking {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  bookings: {
    transport: TrainData[] | CarData[] | AirlineData[] | AllTransportData[];
    hotel: HotelBookingsData[] | [];
    trips: TripData[] | [];
  };
}

interface HotelBookingsData {
  _id: string;
  user: string;
  hotel: {
    _id: string;
    name: string;
    country: string;
    city: string;
  };
  totalPrice: number;
}

interface TripData {
  _id: string;
  trip: {
    _id: string;
    title: string;
    country: string;
    city: string;
  };
  user: string;
  totalPrice: number;
}

interface TrainData {
  _id: string;
  user: string;
  trainTrip: {
    _id: string;
    route: {
      _id: string;
      name: string;
    };
  };
  totalPrice: number;
}

interface CarData {
  _id: string;
  car: {
    _id: string;
    office: {
      _id: string;
      name: string;
      country: string;
      city: string;
    };
    brand: string;
    model: string;
    year: number;
  };
  user: string;
  totalPrice: number;
}

interface AirlineData {
  _id: string;
  outboundFlight: {
    _id: string;
    departureAirport: {
      name: string;
      iata: string;
      city: string;
      country: string;
    };
  };
  returnFlight: {
    _id: string;
    departureAirport: {
      name: string;
      iata: string;
      city: string;
      country: string;
    };
  };
  status: string;
  finalPrice: number;
  user: string;
  airline: string;
}

interface AllBookings {
  data: {
    users: booking[];
  };
}

export const useTripBookings = () => {
  return useQuery({
    queryKey: ["tripBookings"],
    queryFn: async () => {
      const response = await axiosInstance.get<AllBookings>(
        "/users/getAllUsersWithBookings"
      );
      return response.data.data.users;
    },
  });
};
