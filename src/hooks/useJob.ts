import { useQuery } from "@tanstack/react-query";
import { jobApi } from "@/lib/api-client";

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
