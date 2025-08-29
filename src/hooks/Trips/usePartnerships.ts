import axiosInstance from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface Hotels {
  _id: string;
  name: string;
  country: string;
  city: string;
  stars: number;
  coverImage: string | File;
}

interface HotelData {
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  data: {
    hotels: Hotels[];
  };
}

interface Offices {
  _id: string;
  name: string;
  country: string;
  city: string;
  phone: string;
  coverImage: string | File;
}

interface OfficeData {
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  data: {
    carRentalOffices: Offices[];
  };
}

interface Airlines {
  _id: string;
  name: string;
  country: string;
  logo: string | File;
}

interface AirlineData {
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  data: {
    airlines: Airlines[];
  };
}
interface StationData {
  station: {
    _id: string;
    name: string;
    country: string;
    city: string;
    code: string;
  };
  _id: string;
}
interface Routes {
  _id: string;
  name: string;
  stations: StationData[];
}

interface RoutesData {
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  data: {
    routes: Routes[];
  };
}

export const useAllHotels = (query: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ["allHotels", query],
    queryFn: async () => {
      const response = await axiosInstance.get<HotelData>("/hotels", {
        params: {
          page: query.page,
          limit: query.pageSize,
        },
      });
      return {
        hotels: response.data.data.hotels,
        pagination: response.data.result,
      };
    },
    staleTime: 60 * 1000,
  });
};

export const useAllOffices = (query: { pageSize: number }) => {
  const fetchOffices = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get<OfficeData>("/offices/", {
      params: {
        page: pageParam,
        limit: query.pageSize,
      },
    });
    return {
      offices: response.data.data.carRentalOffices,
      pagination: response.data.result,
    };
  };

  return useInfiniteQuery({
    queryKey: ["offices", query],
    queryFn: fetchOffices,
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

export const useAllAirlines = (query: { pageSize: number }) => {
  const fetchAirlines = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get<AirlineData>("/airlines", {
      params: {
        page: pageParam,
        limit: query.pageSize,
      },
    });
    return {
      airlines: response.data.data.airlines,
      pagination: response.data.result,
    };
  };

  return useInfiniteQuery({
    queryKey: ["airlines", query],
    queryFn: fetchAirlines,
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
export const useAllRoutes = (query: { pageSize: number }) => {
  const fetchRoutes = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get<RoutesData>("/routes/", {
      params: {
        page: pageParam,
        limit: query.pageSize,
      },
    });
    return {
      routes: response.data.data.routes,
      pagination: response.data.result,
    };
  };

  return useInfiniteQuery({
    queryKey: ["routes", query],
    queryFn: fetchRoutes,
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
