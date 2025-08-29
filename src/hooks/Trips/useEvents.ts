import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Events {
  _id: string;
  title: string;
  description: string;
  cover: string | File;
  location: string;
}

interface EvantData {
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  data: {
    events: Events[];
  };
}

interface AddEvent {
  title: string;
  description: string;
  cover: string | File;
  location: string;
}

interface SpecificEvent {
  data: {
    event: {
      _id: string;
      title: string;
      description: string;
      cover: string | File;
      location: string;
    };
  };
}
export const useEvents = (query: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ["events", query],
    queryFn: async () => {
      const response = await axiosInstance.get<EvantData>("/events", {
        params: {
          page: query.page,
          limit: query.pageSize,
        },
      });
      return {
        events: response.data.data.events,
        pagination: response.data.result,
      };
    },
    staleTime: 60 * 1000,
  });
};

//create event
const createEvent = async (formData: FormData) => {
  const response = await axiosInstance.post<AddEvent>(`/events`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const useAddEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createEvent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useSpecificEvent = (eventId: string) => {
  return useQuery({
    queryKey: ["specificEvent", eventId],
    queryFn: async () => {
      const response = await axiosInstance.get<SpecificEvent>(
        `/events/${eventId}`
      );
      return response.data.data.event;
    },
  });
};

//update event
export const useUpdateEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventData: FormData) => {
      const response = await axiosInstance.put(
        `/events/${eventId}`,
        eventData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Force a hard refresh of the queries to bypass image caching
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["specificEvent", eventId] });

      // Force refetch to get fresh data including new image URLs
      queryClient.refetchQueries({ queryKey: ["events"] });
      queryClient.refetchQueries({ queryKey: ["specificEvent", eventId] });
    },
  });
};
