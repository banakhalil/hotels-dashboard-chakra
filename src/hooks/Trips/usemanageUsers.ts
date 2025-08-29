import axiosInstance from "@/lib/axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

interface Users {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  //   isVerified: true;
  //   provider: "local";
  role: string;
  //   active: true;
  //   createdAt: "2025-07-24T14:22:07.411Z";
  //   updatedAt: "2025-07-24T14:22:07.411Z";
  //   isVerfied: true;
}

interface UserData {
  data: {
    users: Users[];
  };
}

export const useGetChangeableUsers = () => {
  return useQuery({
    queryKey: ["changeableUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get<UserData>("/users/changeable");
      return response.data.data.users;
    },
  });
};

const CreateGuide = async (data: any) => {
  const response = await axiosInstance.post<JSON>(`/guiders`, data);
  return response.data;
};
export const useCreateGuide = (options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { data: any }>({
    mutationFn: ({ data }) => CreateGuide(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changeableUsers"] });
      options?.onSuccess?.();
    },
    ...options,
  });
};

export const useUpdateUserRole = (userId: string, options?: any) => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: async (role) => {
      const response = await axiosInstance.put(`/users/${userId}`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changeableUsers"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      options?.onSuccess?.();
    },
    ...options,
  });
};
