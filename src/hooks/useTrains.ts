import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface TrainData {
  _id: string;
  name: string;
  speed: number;
  numberOfSeats: number;
  status: string;
  __v: number;
  booked_until: string;
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
