import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api-client";
import type {
  AdminApplicantRow,
  AdminRecruiterRow,
  AdminStaffRow,
} from "@/types";
import { toast } from "sonner";

export type AdminEntityKind = "applicant" | "recruiter" | "staff";

/** Full profile for admin PATCH forms (GET …/applicants|recruiters|admins/:id). */
export function useAdminEntityDetail(
  kind: AdminEntityKind | null,
  profileId: string | null,
  open: boolean,
) {
  return useQuery({
    queryKey: ["admin", "entity", kind, profileId],
    queryFn: async (): Promise<
      AdminApplicantRow | AdminRecruiterRow | AdminStaffRow
    > => {
      if (kind === "applicant") {
        const res = await adminApi.getApplicant(profileId!);
        return res.data;
      }
      if (kind === "recruiter") {
        const res = await adminApi.getRecruiter(profileId!);
        return res.data;
      }
      const res = await adminApi.getStaffAdmin(profileId!);
      return res.data;
    },
    enabled: open && !!kind && !!profileId,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAdminApplicants(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["admin", "applicants", params],
    queryFn: () => adminApi.getApplicants(params),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAdminRecruiters(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["admin", "recruiters", params],
    queryFn: () => adminApi.getRecruiters(params),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAdminStaff(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["admin", "staff", params],
    queryFn: () => adminApi.getStaffAdmins(params),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "ACTIVE" | "BLOCKED" | "DELETED";
    }) => adminApi.updateUserStatus(userId, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Status updated");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function useSoftDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.softDeleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("User archived (soft delete)");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function usePatchAdminApplicant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      files,
    }: {
      id: string;
      payload: Record<string, unknown>;
      files?: { image?: File; cv?: File };
    }) => adminApi.patchApplicant(id, payload, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Applicant profile updated");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function usePatchAdminRecruiter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      files,
    }: {
      id: string;
      payload: Record<string, unknown>;
      files?: { image?: File; companyLogo?: File };
    }) => adminApi.patchRecruiter(id, payload, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Recruiter profile updated");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function usePatchAdminStaffProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      files,
    }: {
      id: string;
      payload: Record<string, unknown>;
      files?: { image?: File };
    }) => adminApi.patchAdminProfile(id, payload, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Staff profile updated");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

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
