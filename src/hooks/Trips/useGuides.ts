import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Guide {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
    provider: string;
    role: string;
    active: boolean;
  };
  yearsOfExperience: number;
  languages: string[];
  rating: number;
  available: boolean;
}

interface GuideData {
  data: Guide[];
}

export const useGuides = () => {
  return useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const response = await axiosInstance.get<GuideData>("/guiders");
      return response.data.data;
    },
  });
};
