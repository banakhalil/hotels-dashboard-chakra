import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Cities {
  // status: string;
  cities: string[];
}

const useCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await axiosInstance.get<Cities>("/stations/getCities");
      // console.log("Cities API Response:", response.data);
      return response.data.cities;
    },
  });
};
export default useCities;
