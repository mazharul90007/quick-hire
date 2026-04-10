import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryApi, subIndustryApi } from "@/lib/api-client";
import { toast } from "sonner";

export const useCreateIndustry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; logo: File }) =>
      industryApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["industries"] });
      toast.success("Industry created");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
};

export const useCreateSubIndustry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; industryId: string }) =>
      subIndustryApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["industries"] });
      qc.invalidateQueries({ queryKey: ["sub-industries"] });
      toast.success("Sub-industry created");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
};

export const useUpdateIndustry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      logoFile,
    }: {
      id: string;
      name?: string;
      logoFile?: File;
    }) => industryApi.update(id, { name, logoFile }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["industries"] });
      toast.success("Industry updated");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
};

export const useUpdateSubIndustry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { name?: string; industryId?: string };
    }) => subIndustryApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["industries"] });
      qc.invalidateQueries({ queryKey: ["sub-industries"] });
      toast.success("Sub-industry updated");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
};

function extractErr(e: unknown): string {
  if (
    e &&
    typeof e === "object" &&
    "response" in e &&
    e.response &&
    typeof e.response === "object" &&
    "data" in e.response &&
    e.response.data &&
    typeof e.response.data === "object" &&
    "message" in e.response.data
  ) {
    return String((e.response.data as { message: string }).message);
  }
  return "Request failed";
}
