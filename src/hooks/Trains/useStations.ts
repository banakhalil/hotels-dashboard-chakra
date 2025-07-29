import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface StationData {
  location: {
    longitude: number;
    latitude: number;
  };
  _id?: string;
  name: string;
  city: string;
  country: string;
  code: string;
}

interface AllStations {
  data: {
    stations: StationData[];
  };
}

//get all stations
const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      const response = await axiosInstance.get<AllStations>("/stations/");
      return response.data.data.stations;
    },
  });
};
export default useStations;
