import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Trips {
  _id: string;
  title: string;
  description: string;
  tripCover: string | File;
  price: number;
  duration: number;
  country: string;
  city: string;
  maxGroupSize: number;
  language: string;
  category: string;
  requirements: string[];
  //   registeredUsers: [
  //     {
  //       userId: "6882418bde832b209b66276f";
  //       tripTicketId: "68a4564118a4af66a92ca811";
  //       numberOfPassengers: 1;
  //       _id: "68a4564118a4af66a92ca813";
  //     },
  //     {
  //       userId: "6882418bde832b209b66276f";
  //       tripTicketId: "68a457f518a4af66a92ca86e";
  //       numberOfPassengers: 1;
  //       _id: "68a457f518a4af66a92ca870";
  //     },
  //     {
  //       userId: "6882418bde832b209b66276f";
  //       tripTicketId: "68a4585d18a4af66a92ca89a";
  //       numberOfPassengers: 1;
  //       _id: "68a4585d18a4af66a92ca89c";
  //     },
  //     {
  //       userId: "6882418bde832b209b66276f";
  //       tripTicketId: "68a45b9918a4af66a92ca951";
  //       numberOfPassengers: 1;
  //       _id: "68a45b9a18a4af66a92ca953";
  //     },
  //     {
  //       userId: "68824193de832b209b662775";
  //       tripTicketId: "68a55e4eebb3cccd1895f58b";
  //       numberOfPassengers: 1;
  //       _id: "68a55e4eebb3cccd1895f58d";
  //     }
  //   ];
  guider: {
    _id: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      isVerified: boolean;
      // password: "$2b$10$yLlyUV3VhRyW0HSFPbvGkO3ZCG0g28VP3W4PD8q4aR0s6U1XI3HlS";
      // provider: "local";
      // role: "guider";
      // active: true;
    };
    yearsOfExperience: number;
    languages: string[];
    rating: number;
    available: boolean;
  };
  status: string;
  events: TripEvents[];
}

interface TripEvents {
  eventId: {
    _id: string;
    title: string;
    description: string;
    cover: string | File;
    location: string;
  };
  order: number;
  duration: number;
  startTime: string;
  endTime: string;
  _id: string;
}
interface AddTrip {
  title: string;
  description: string;
  tripCover: string | File;
  price: number;
  country: string;
  city: string;
  maxGroupSize: number;
  category: string;
  guider: string;
  // events: AddEventToTrip[];
}

interface AddEventToTrip {
  eventId: string;
  duration: number;
  startTime: string;
}
interface TripData {
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  data: Trips[];
}
interface SpecificTripData {
  data: Trips;
}

export const useTrips = (query: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ["trips", query],
    queryFn: async () => {
      const response = await axiosInstance.get<TripData>("/trips", {
        params: {
          page: query.page,
          limit: query.pageSize,
        },
      });
      return {
        trips: response.data.data,
        pagination: response.data.result,
      };
    },
    staleTime: 60 * 1000,
  });
};

export const useSpecificTrip = (tripId: string) => {
  return useQuery({
    queryKey: ["specificTrip", tripId],
    queryFn: async () => {
      const response = await axiosInstance.get<SpecificTripData>(
        `/trips/${tripId}`
      );
      return response.data.data;
    },
  });
};

//create trip
const createTrip = async (formData: FormData) => {
  const response = await axiosInstance.post<AddTrip>(`/trips`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const useAddTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createTrip(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};

const AddEventToTrip = async (tripId: string, data: AddEventToTrip) => {
  const response = await axiosInstance.post<AddEventToTrip>(
    `/trips/${tripId}/events`,
    data
  );
  return response.data;
};
export const useAddEventToTrip = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tripId,
      formData,
    }: {
      tripId: string;
      formData: AddEventToTrip;
    }) => AddEventToTrip(tripId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["specificTrip", tripId] });
    },
  });
};

//deleting an event
export const deleteEvent = async (
  tripId: string,
  eventId: string
): Promise<void> => {
  await axiosInstance.delete(`/trips/${tripId}/events/${eventId}`);
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, eventId }: { tripId: string; eventId: string }) =>
      deleteEvent(tripId, eventId),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["specificTrip", tripId] });
    },
  });
};

//update trip
export const useUpdateTrip = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripData: FormData) => {
      const response = await axiosInstance.put(`/trips/${tripId}`, tripData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Force a hard refresh of the queries to bypass image caching
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["specificTrip", tripId] });
      // Force refetch to get fresh data including new image URLs
      queryClient.refetchQueries({ queryKey: ["trips"] });
      queryClient.refetchQueries({ queryKey: ["specificTrip", tripId] });
    },
  });
};
