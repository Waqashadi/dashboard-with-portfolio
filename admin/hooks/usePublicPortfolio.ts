"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { DashboardResponse } from "@/types/home";

export const usePublicPortfolio = () =>
  useQuery<DashboardResponse>({
    queryKey: ["public-portfolio"],
    queryFn: async () => {
      const response = await api.get<DashboardResponse>("/portfolio");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
