import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export interface UserData {
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      avatar: File;
      isVerified: boolean;
      active: boolean;
    };
  };
}
//getUser
export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await axiosInstance.get<UserData>("/users/profile");
      return response.data.data.user;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const updateProfile = async (data: FormData) => {
    const response = await axiosInstance.put(`/users/updateMe`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  return useMutation<unknown, Error, FormData>({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  const updatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    passwordConfirm: string;
  }) => {
    const response = await axiosInstance.put(`/users/changeMyPassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  return useMutation<
    unknown,
    Error,
    {
      currentPassword: string;
      newPassword: string;
      passwordConfirm: string;
    }
  >({
    mutationFn: updatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
