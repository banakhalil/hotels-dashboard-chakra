import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";

export interface HotelData {
  _id?: string;
  name: string;
  slug: string;
  location: string;
  country: string;
  city: string;
  description: string;
  amenities: string[];
  stars: number;
  coverImage: File;
  images: File[];
  createdAt: string;
  updatedAt: string;
  rooms: RoomData[];
}
// type WithoutId = Omit<HotelData,"_id">;
export interface RoomData {
  _id: string;
  roomType: string;
  description: string;
}
export interface AllHotels {
  data: {
    hotels: HotelData[];
  };
}

interface SpecificHotels {
  data: {
    hotel: HotelData;
  };
}
//get all hotels
const useHotels = () => {
  const fetchHotels = async () => {
    const response = await axiosInstance.get<AllHotels>("/hotels");
    return response.data.data.hotels;
  };

  return useQuery({
    queryKey: ["hotels"],
    queryFn: fetchHotels,
  });
};

export default useHotels;

//get specific hotel
export const useSpecificHotel = (hotelId: string) => {
  const fetchHotels = async () => {
    const response = await axiosInstance.get<SpecificHotels>(
      `/hotels/${hotelId}`
    );
    return response.data.data.hotel;
  };

  return useQuery({
    queryKey: ["specifichotel", hotelId],
    queryFn: fetchHotels,
  });
};

//update hotel
export const useUpdateHotel = (hotelId: string) => {
  const queryClient = useQueryClient();

  const updateHotel = async (data: FormData) => {
    const response = await axiosInstance.put(`/hotels/${hotelId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  return useMutation<unknown, Error, FormData>({
    mutationFn: updateHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["specifichotel", hotelId] });
    },
  });
};

//deleting a hotel
export const deleteHotel = async (hotelId: string): Promise<void> => {
  await axiosInstance.delete(`/hotels/${hotelId}`);
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHotel,
    onMutate: async (hotelId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["hotels"] });
      await queryClient.cancelQueries({ queryKey: ["specifichotel", hotelId] });

      // Snapshot the previous values
      const previousHotels = queryClient.getQueryData<HotelData[]>(["hotels"]);
      const previousHotel = queryClient.getQueryData<SpecificHotels>([
        "specifichotel",
        hotelId,
      ]);

      // Optimistically remove the hotel from the lists
      queryClient.setQueryData<HotelData[]>(
        ["hotels"],
        (old) => old?.filter((hotel) => hotel._id !== hotelId) || []
      );

      queryClient.setQueryData(["specifichotel", hotelId], null);

      // Return a context with the snapshotted values
      return { previousHotels, previousHotel, hotelId };
    },
    onError: (err, hotelId, context) => {
      if (context) {
        // Restore both caches on error
        queryClient.setQueryData(["hotels"], context.previousHotels);
        queryClient.setQueryData(
          ["specifichotel", context.hotelId],
          context.previousHotel
        );
      }
    },
    onSettled: (_, __, hotelId) => {
      // Always invalidate both queries after completion
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["specifichotel", hotelId] });
    },
  });
};

//create hotel
export const createHotel = async (formData: FormData) => {
  const response = await axiosInstance.post("/hotels", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useAddHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
