import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type OfficeData } from "./useOffice";
import axiosInstance from "@/lib/axios";

interface CarsData {
  _id: string;
  office: OfficeData;
  brand: string;
  model: string;
  gearType: string;
  fuelType: string;
  color: string;
  status: string;
  seats: number;
  year: number;
  pricePerDay: number;
  images: File[] | string[];
}

interface Cars {
  data: {
    cars: CarsData[];
  };
}
interface SpecificCar {
  data: {
    car: CarsData;
  };
}

//get cars
export const useCars = (officeId: string) => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const response = await axiosInstance.get<Cars>(
        `/offices/${officeId}/cars`
      );
      return response.data.data.cars;
    },
  });
};

//get specific car
export const useSpecificCar = (officeId: string, carId: string) => {
  return useQuery({
    queryKey: ["specificCar", officeId, carId],
    queryFn: async () => {
      const response = await axiosInstance.get<SpecificCar>(
        `/offices/${officeId}/cars/${carId}`
      );
      return response.data.data.car;
    },
  });
};

//create car
const createCar = async (officeId: string, formData: FormData) => {
  const response = await axiosInstance.post(
    `/offices/${officeId}/cars/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
export const useAddCar = (officeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createCar(officeId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["office"] });
    },
  });
};

//update car
export const useUpdateCar = (officeId: string, carId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carData: FormData) => {
      const response = await axiosInstance.put(
        `/offices/${officeId}/cars/${carId}`,
        carData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};
