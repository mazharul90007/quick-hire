import { useMutation, useQuery } from "@tanstack/react-query";
import { applicationApi } from "@/lib/api-client";

export const useCreateApplication = () => {
  return useMutation({
    mutationFn: (payload: {
      jobId: string;
      cv: File;
      cover_note?: string;
      expectedSalary?: string;
    }) => applicationApi.createApplication(payload),
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGetApplications = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => applicationApi.getAll(params),
  });
};

export const useGetApplication = (id: string) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationApi.getOne(id),
    enabled: !!id,
  });
};
