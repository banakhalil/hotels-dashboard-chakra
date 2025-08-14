import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

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
}
export interface AllHotels {
  data: HotelData[];
}

interface SpecificHotels {
  data: {
    hotel: HotelData;
  };
}

export interface RoomData {
  _id?: string;
  hotel: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  isAvailable: boolean;
  roomNumber: string;
  amenities: string[];
  isActive?: boolean;
  image: File;
}

export interface AllRooms {
  data: {
    rooms: RoomData[];
    totalCount?: number;
  };
}
export interface SpecificRoom {
  data: {
    room: RoomData;
  };
}
const useHotels = (sortValue: string, keyWord?: string) => {
  return useQuery({
    queryKey: ["hotels", sortValue, keyWord], // Value becomes part of the query key
    queryFn: async () => {
      const url =
        sortValue && keyWord
          ? `/hotels/manager${sortValue}&keyWord=${keyWord}`
          : sortValue && !keyWord
          ? `/hotels/manager${sortValue}`
          : keyWord
          ? `/hotels/manager?keyWord=${keyWord}`
          : `/hotels/manager`;
      const response = await axiosInstance.get<AllHotels>(url);
      return response.data.data;
    },
    // Optional: keep previous data while fetching new data
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

//creating hotels
export const useAddHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};
//-------------------------------------------------ROOMS--------------------------------------------------------
//get rooms
// interface RoomsQuery {
//   page: number;
//   pageSize: number;
// }
// export const useRooms = (hotelId: string, query: RoomsQuery) => {
//   const fetchRooms = async () => {
//     const response = await axiosInstance.get<AllRooms>(
//       `/hotels/${hotelId}/rooms`,
//       {
//         params: {
//           page: (query.page - 1) * query.pageSize,
//           limit: query.pageSize,
//         },
//       }
//     );
//     return response.data.data.rooms;
//   };

//   return useQuery({
//     queryKey: ["rooms", hotelId, query],
//     queryFn: fetchRooms,
//     staleTime: 60 * 1000,
//     placeholderData: keepPreviousData,
//   });
// };
interface RoomsQuery {
  pageSize: number;
  sortValue: string;
}
interface RoomsResponse {
  status: string;
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  data: {
    rooms: RoomData[];
  };
}

export const useRooms = (hotelId: string, query: RoomsQuery) => {
  const fetchRooms = async ({ pageParam = 1 }) => {
    const url = query.sortValue
      ? `/hotels/${hotelId}/rooms${query.sortValue}`
      : `/hotels/${hotelId}/rooms`;
    const response = await axiosInstance.get<RoomsResponse>(url, {
      params: {
        page: pageParam,
        limit: query.pageSize,
      },
    });

    return {
      rooms: response.data.data.rooms,
      pagination: response.data.result,
    };
  };

  return useInfiniteQuery({
    queryKey: ["rooms", hotelId, query],
    queryFn: fetchRooms,
    staleTime: 60 * 1000,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });
};

export const useSpecificRoom = (hotelId: string, roomId: string) => {
  const fetchHotels = async () => {
    const response = await axiosInstance.get<SpecificRoom>(
      `/hotels/${hotelId}/rooms/${roomId}`
    );
    return response.data.data.room;
  };

  return useQuery({
    queryKey: ["specificroom", hotelId, roomId],
    queryFn: fetchHotels,
  });
};

//delete room
export const deleteRoom = async (
  hotelId: string,
  roomId: string
): Promise<void> => {
  await axiosInstance.delete(`/hotels/${hotelId}/rooms/${roomId}`);
};
export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hotelId, roomId }: { hotelId: string; roomId: string }) =>
      deleteRoom(hotelId, roomId),
    onMutate: async ({ hotelId, roomId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["hotels"] });
      await queryClient.cancelQueries({ queryKey: ["rooms", hotelId] });

      // Snapshot the previous values
      const previousRooms = queryClient.getQueryData<RoomData[]>([
        "rooms",
        hotelId,
      ]);

      // Optimistically remove the room from the list
      if (previousRooms) {
        queryClient.setQueryData<RoomData[]>(
          ["rooms", hotelId],
          previousRooms.filter((room) => room._id !== roomId)
        );
      }

      // Return a context with the snapshotted values
      return { previousRooms, hotelId };
    },
    onError: (err, variables, context) => {
      if (context) {
        // Restore cache on error
        queryClient.setQueryData(
          ["rooms", context.hotelId],
          context.previousRooms
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Always invalidate queries after completion
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.hotelId] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
};

//update room
export const useUpdateRoom = (hotelId: string, roomId: string) => {
  const queryClient = useQueryClient();

  const updateRoom = async (data: FormData) => {
    const response = await axiosInstance.put(
      `/hotels/${hotelId}/rooms/${roomId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  return useMutation<unknown, Error, FormData>({
    mutationFn: updateRoom,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", hotelId] });
      queryClient.invalidateQueries({
        queryKey: ["specificroom", hotelId, roomId],
      });
    },
  });
};

//creating Room
export const createRoom = async (hotelId: string, formData: FormData) => {
  const response = await axiosInstance.post(
    `/hotels/${hotelId}/rooms`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const useAddRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hotelId,
      formData,
    }: {
      hotelId: string;
      formData: FormData;
    }) => createRoom(hotelId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.hotelId] });
    },
  });
};
