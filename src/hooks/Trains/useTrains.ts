import axiosInstance from "@/lib/axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export interface TrainData {
  _id: string;
  name: string;
  speed: number;
  numberOfSeats: number;
  status?: string;
  booked_until?: string;
}

interface AllTrains {
  data: {
    trains: TrainData[];
  };
}

//get all trains
const useTrains = () => {
  return useQuery({
    queryKey: ["trains"],
    queryFn: async () => {
      const response = await axiosInstance.get<AllTrains>("/trains");
      return response.data.data.trains;
    },
  });
};
export default useTrains;

//add train
export const useAddTrain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripData: TrainData) => {
      const response = await axiosInstance.post("/trains/", tripData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trains"] });
    },
  });
};
