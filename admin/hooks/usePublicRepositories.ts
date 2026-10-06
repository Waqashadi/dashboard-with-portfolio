"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { RepositoryListResponse } from "@/types/github";

export const usePublicRepositories = (page = 1, limit = 100) =>
  useQuery<RepositoryListResponse>({
    queryKey: ["public-repositories", page, limit],
    queryFn: async () => {
      const response = await api.get<RepositoryListResponse>(
        `/repositories?page=${page}&limit=${limit}&sort=stars`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
