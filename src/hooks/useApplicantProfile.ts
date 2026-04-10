import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicantApi, type ProfileUploadFiles } from "@/lib/api-client";

export const useApplicantProfile = () => {
  return useQuery({
    queryKey: ["applicant-profile"],
    queryFn: () => applicantApi.getMyProfile(),
  });
};

export const useUpdateApplicantProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      data: Record<string, unknown>;
      files?: Pick<ProfileUploadFiles, "image" | "cv">;
    }) => applicantApi.updateMyProfile(payload.data, payload.files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicant-profile"] });
    },
  });
};
