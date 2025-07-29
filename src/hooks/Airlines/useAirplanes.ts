import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Airplane {
  _id: string;
  model: string;
  registrationNumber: string;
  seatsEconomy: number;
  seatsBusiness: number;
  status: string;
  currentLocation: string;
  airline: string;
}

interface AirplaneData {
  data: Airplane[];
}
interface SpecificAirplane {
  data: {
    plane: {
      _id: string;
      model: string;
      registrationNumber: string;
      seatsEconomy: number;
      seatsBusiness: number;
      status: string;
      currentLocation: string;
      airline: string;
    };
  };
}

const useAirplanes = () => {
  return useQuery({
    queryKey: ["airplanes"],
    queryFn: async () => {
      const response = await axiosInstance.get<AirplaneData>(
        "/planes/myPlanes"
      );
      return response.data.data;
    },
  });
};

export default useAirplanes;

//get specific plane
export const useSpecificAirplane = (planeId: string) => {
  return useQuery({
    queryKey: ["specificAirplane", planeId],
    queryFn: async () => {
      const response = await axiosInstance.get<SpecificAirplane>(
        `/planes/${planeId}`
      );
      return response.data.data.plane;
    },
  });
};

//update plane
export const useUpdateAirplane = (planeId: string) => {
  const queryClient = useQueryClient();

  const updateAirplane = async (data: FormData) => {
    // Convert FormData to JSON object
    const jsonData = {
      seatsEconomy: parseInt(data.get("seatsEconomy") as string),
      seatsBusiness: parseInt(data.get("seatsBusiness") as string),
    };

    const response = await axiosInstance.put(`/planes/${planeId}`, jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  return useMutation<unknown, Error, FormData>({
    mutationFn: updateAirplane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airplanes"] });
      queryClient.invalidateQueries({
        queryKey: ["specificAirplane", planeId],
      });
    },
  });
};

//create plane
const createPlane = async (data: FormData) => {
  const response = await axiosInstance.post("/planes", data);
  return response.data.data; // Access the data property from the response
};

//creating planes
export const useCreatePlane = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, FormData>({
    mutationFn: createPlane,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airplanes"] });
    },
  });
};
