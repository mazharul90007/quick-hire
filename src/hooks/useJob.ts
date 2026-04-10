import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "@/lib/api-client";
import { JobFilters } from "@/types";

export const useGetFeaturedJobs = () => {
  return useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => {
      const response = await jobApi.getAllJobs({
        featured: true,
        status: "ACTIVE",
        limit: 12,
      });
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
        status: "ACTIVE",
      });
      return response.data.data;
    },
  });
};

export const useGetAllJobs = (
  filters: JobFilters = {},
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const { allStatuses, ...rest } = filters;
      const params: Record<string, unknown> = Object.fromEntries(
        Object.entries(rest).filter(
          ([, v]) => v !== undefined && v !== null && v !== "",
        ),
      );
      if (allStatuses) {
        delete params.status;
      } else if (params.status === undefined) {
        params.status = "ACTIVE";
      }
      const body = await jobApi.getAllJobs(params);
      // API envelope: { success, message, data: { meta, data: jobs[] } }
      return body.data;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (payload: any) => jobApi.createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      jobApi.updateJob(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["latest-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["featured-jobs"] });
    },
  });
};

export const useGetSingleJob = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobApi.getSingleJob(id),
    enabled: !!id,
  });
};
