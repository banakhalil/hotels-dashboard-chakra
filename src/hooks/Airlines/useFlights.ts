import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Flight {
  _id: string;
  airline: {
    _id: string;
    name: string;
    logo: string;
  };
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
  arrivalDate: string;
  priceEconomy: number;
  priceBusiness: number;
  duration: number;
  gateNumber: number;
}

interface FlightData {
  data: Flight[];
}

interface Countries {
  name: string;
  code: string;
}
interface CountriesData {
  data: Countries[];
}

interface Airport {
  name: string;
  iata: string;
  city: string;
  country: string;
  cityCode: string;
}
interface AirportData {
  data: Airport[];
}

interface CreateFlightData {
  plane: string;
  departureCountry: string;
  arrivalCountry: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  returnDepartureDate: string;
  duration: number;
  priceEconomy: number;
  priceBusiness: number;
}

//get flights
const useFlights = (airlineId: string) => {
  return useQuery({
    queryKey: ["flights"],
    queryFn: async () => {
      const response = await axiosInstance.get<FlightData>(
        `/airlines/${airlineId}/flights`
      );
      return response.data.data;
    },
  });
};

export default useFlights;

//update flights
export const useUpdateFlight = (flightId: string) => {
  const queryClient = useQueryClient();

  const updateAirplane = async (data: FormData) => {
    const response = await axiosInstance.put(`/flights/${flightId}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  return useMutation<unknown, Error, FormData>({
    mutationFn: updateAirplane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
};

//create flight
const createFlight = async (data: FormData) => {
  const response = await axiosInstance.post<CreateFlightData>(
    "/flights",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; // Access the data property from the response
};

//creating flight
export const useCreateFlight = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FormData>({
    mutationFn: createFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
};

//get airports
export const useAirports = () => {
  return useQuery({
    queryKey: ["airports"],
    queryFn: async () => {
      const response = await axiosInstance.get<AirportData>("/data/airports");
      return response.data.data;
    },
  });
};

//get countries
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await axiosInstance.get<CountriesData>(
        "/data/countries"
      );
      return response.data.data;
    },
  });
};
