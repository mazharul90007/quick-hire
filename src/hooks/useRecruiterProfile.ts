import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recruiterApi, type ProfileUploadFiles } from "@/lib/api-client";

export const useRecruiterProfile = () => {
  return useQuery({
    queryKey: ["recruiter-profile"],
    queryFn: () => recruiterApi.getMyProfile(),
  });
};

export const useUpdateRecruiterProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      data: Record<string, unknown>;
      files?: Pick<ProfileUploadFiles, "image" | "companyLogo">;
    }) => recruiterApi.updateMyProfile(payload.data, payload.files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiter-profile"] });
    },
  });
};
