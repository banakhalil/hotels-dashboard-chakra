import axiosInstance from "@/lib/axios";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export interface OfficeData {
  _id: string;
  cars?: number;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  coverImage: File | string;
}

interface Office {
  data: {
    office: OfficeData;
  };
}

//get office
export const useOffice = () => {
  return useQuery({
    queryKey: ["office"],
    queryFn: async () => {
      const response = await axiosInstance.get<Office>("/offices/my-office");
      return response.data.data.office;
    },
  });
};

//update office
export const useUpdateOffice = (officeId: string) => {
  const queryClient = useQueryClient();

  const updateOffice = async (data: FormData) => {
    const response = await axiosInstance.put(`/offices/${officeId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  return useMutation<unknown, Error, FormData>({
    mutationFn: updateOffice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["office"] });
    },
  });
};

//create office
const createOffice = async (formData: FormData) => {
  const response = await axiosInstance.post<OfficeData>(`/offices`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const useAddOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createOffice(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["office"] });
    },
  });
};
