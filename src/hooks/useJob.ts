import { useMutation, useQuery } from "@tanstack/react-query";
import { jobApi } from "@/lib/api-client";
import { JobFilters } from "@/types";

export const useGetFeaturedJobs = () => {
  return useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => {
      const response = await jobApi.getAllJobs({ featured: true });
      return response.data.data;
    },
  });
};

export const useGetLatestJobs = () => {
  return useQuery({
    queryKey: ["latest-jobs"],
    queryFn: async () => {
      const response = await jobApi.getAllJobs({
        limit: 8,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      return response.data.data;
    },
  });
};

export const useGetAllJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const response = await jobApi.getAllJobs(filters);
      return response.data;
    },
  });
};
export const useCreateJob = () => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (payload: any) => jobApi.createJob(payload),
  });
};

export const useGetSingleJob = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobApi.getSingleJob(id),
    enabled: !!id,
  });
};
