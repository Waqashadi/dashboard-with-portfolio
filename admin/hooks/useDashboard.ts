
"use client";

import { useQuery } from "@tanstack/react-query";
import api, { shouldRetryApiRequest } from "@/lib/api";

import type { DashboardResponse } from "@/types/home";

export const useDashboard = () => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],

    queryFn: async () => {
      const response = await api.get<DashboardResponse>(
        "/admin/dashboard",
      );

      return response.data;
    },

    staleTime: 5 * 60 * 1000,
    retry: shouldRetryApiRequest,
  });
};