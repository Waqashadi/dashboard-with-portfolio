"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import api, { shouldRetryApiRequest } from "@/lib/api";

import type {
  GithubProfile,
  GithubProfileFormData,
  GithubProfileResponse,
} from "@/types/github";

/**
 * Get GitHub profile
 */
export const useGithubProfile = () => {
  return useQuery({
    queryKey: ["profile"],

    queryFn: async () => {
      const response =
        await api.get<GithubProfileResponse>(
          "/admin/profile"
        );

      return response.data;
    },

    staleTime: 5 * 60 * 1000,
    retry: shouldRetryApiRequest,
  });
};

/**
 * Create GitHub profile
 */
export const useCreateGithubProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GithubProfileFormData) => {
      const response = await api.post<GithubProfileResponse>(
        "/admin/profile",
        data
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
};

/**
 * Sync GitHub profile
 */
export const useSyncGithubProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response =
        await api.post<GithubProfileResponse>(
          "/admin/profile/sync"
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
};

/**
 * Update GitHub profile
 */
export const useUpdateGithubProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<GithubProfile>;
    }) => {
      const response =
        await api.put<GithubProfileResponse>(
          `/admin/profile/${id}`,
          data
        );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
};

/**
 * Delete GitHub profile
 */
export const useDeleteGithubProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/admin/profile/${id}`);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
};