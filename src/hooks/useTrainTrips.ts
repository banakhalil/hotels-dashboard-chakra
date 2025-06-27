import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface TrainTrip {
  _id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableSeats: number;
  price: number;
  firstStation: {
    name: string;
    country: string;
    city: string;
    code: string;
  };
  lastStation: {
    name: string;
    country: string;
    city: string;
    code: string;
  };
}

interface TrainTripResponse {
  data: {
    trips: TrainTrip[];
  };
}

//get trip by city
const useTrainTrips = () => {
  return useQuery({
    queryKey: ["traintrips"],
    queryFn: async () => {
      const response = await axiosInstance.get<TrainTripResponse>(
        `/train-trips/managerTrips`
      );
      return response.data.data.trips;
    },
  });
};

export default useTrainTrips;

interface AddTripData {
  route: string;
  train: string;
  price: number;
  departureTime: string;
  stopDuration: number;
}

//add trip
export const useAddTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripData: AddTripData) => {
      const response = await axiosInstance.post("/train-trips/", tripData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the routes query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["traintrips"] });
      queryClient.invalidateQueries({ queryKey: ["trains"] });
    },
  });
};

interface SpecificTripData {
  data: {
    traintrip: {
      route: string;
      train: string;
      price: number;
      departureTime: string;
      stopDuration: number;
    };
  };
}

//get specific trip
export const useSpecificTrainTrip = (tripId: string) => {
  return useQuery({
    queryKey: ["traintrips", tripId],
    queryFn: async () => {
      const response = await axiosInstance.get<SpecificTripData>(
        `/train-trips/${tripId}`
      );
      return response.data.data.traintrip;
    },
  });
};

//update trip
export const useUpdateTrip = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripData: AddTripData) => {
      const response = await axiosInstance.put(
        `/train-trips/${tripId}`,
        tripData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the routes query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["traintrips"] });
      queryClient.invalidateQueries({ queryKey: ["trains"] });
    },
  });
};
