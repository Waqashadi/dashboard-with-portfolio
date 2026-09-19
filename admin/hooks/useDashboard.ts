"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

import type {
  HomeData,
} from "@/types/home";

interface DashboardResponse {
  success: boolean;
  data: HomeData;
}

export const useDashboard = () => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],

    queryFn: async () => {
      const response =
        await api.get<DashboardResponse>(
          "/dashboard"
        );

      return response.data;
    },

    staleTime: 5 * 60 * 1000,
  });
};