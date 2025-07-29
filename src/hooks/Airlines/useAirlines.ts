import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface AirlineData {
  data: {
    _id: string;
    name: string;
    country: string;
    description: string;
    logo: string;
    destinationCountries: string;
    planesNum: number;
  };
}

const useAirlines = () => {
  return useQuery({
    queryKey: ["airlines"],
    queryFn: async () => {
      const response = await axiosInstance.get<AirlineData>(
        "/airlines/myAirline"
      );
      return response.data.data; // Return the nested data object
    },
  });
};

export default useAirlines;

//update airline
export const useUpdateAirline = () => {
  const queryClient = useQueryClient();

  const updateAirline = async (data: FormData) => {
    const response = await axiosInstance.put(`/airlines/myAirline`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data; // Return the nested data object
  };

  return useMutation<unknown, Error, FormData>({
    mutationFn: updateAirline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airlines"] });
    },
  });
};

//create airline
const createAirline = async (formData: FormData) => {
  const response = await axiosInstance.post(`/airlines`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const useAddAirline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createAirline(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airlines"] });
    },
  });
};
