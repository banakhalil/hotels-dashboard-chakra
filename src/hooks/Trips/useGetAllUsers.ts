import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Users {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserData {
  data: {
    users: Users[];
  };
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get<UserData>("/users/getAllUsers");
      return response.data.data.users;
    },
  });
};
