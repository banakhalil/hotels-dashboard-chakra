import axiosInstance from "@/lib/axios";
import { type StationData } from "./useStations";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface StationInRoute {
  station: {
    _id: string;
    name: string;
    city: string;
    country: string;
    code: string;
    location: {
      longitude: number;
      latitude: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  _id: string;
}

export interface Route {
  _id: string;
  name: string;
  routeManager: string;
  isInternational: boolean;
  stations: StationInRoute[];
}

interface RouteResponse {
  status: string;
  result: {
    currentPage: number;
    limit: number;
    numOfPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  routes: Route[];
}

interface UseRoutesOptions {
  pageSize?: number;
}
//get all routes
const useRoutes = (options: UseRoutesOptions = {}) => {
  const { pageSize = 10 } = options;

  const fetchRoutes = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get<RouteResponse>(
      "/routes/managerRoutes",
      {
        params: {
          page: pageParam,
          limit: pageSize,
        },
      }
    );

    return {
      routes: response.data.routes,
      pagination: response.data.result,
    };
  };

  return useInfiniteQuery({
    queryKey: ["routes", pageSize],
    queryFn: fetchRoutes,
    staleTime: 60 * 1000,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });
};
export default useRoutes;

//add route
interface AddRouteData {
  name: string;
  stations: { station: string }[];
  isInternational: boolean;
}

export const useAddRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeData: AddRouteData) => {
      const response = await axiosInstance.post("/routes", routeData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the routes query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
};

//specific route

export interface SpecificRoute {
  data: {
    route: {
      _id: string;
      name: string;
      routeManager: string;
      isInternational: boolean;
      stations: StationInRoute[];
    };
  };
}
export const useSpecificRoute = (routeId: string) => {
  return useQuery({
    queryKey: ["specificRoute", routeId],
    queryFn: async () => {
      const response = await axiosInstance.get<SpecificRoute>(
        `/routes/${routeId}`
      );
      console.log("specific route", response.data.data.route);
      return response.data.data.route;
    },
  });
};

//update route
interface UpdateRouteData {
  name: string;
  stations: { station: string }[];
  isInternational: boolean;
}

export const useUpdateRoute = (routeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeData: UpdateRouteData) => {
      const response = await axiosInstance.put(`/routes/${routeId}`, routeData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the routes query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      queryClient.invalidateQueries({ queryKey: ["specificRoute", routeId] });
    },
  });
};
