import { useMutation } from "@tanstack/react-query";
import {
  authApi,
  type CreateAdminPayload,
  type RegisterApplicantPayload,
  type RegisterRecruiterPayload,
} from "@/lib/api-client";
import { toast } from "sonner";

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

export function useRegisterApplicant() {
  return useMutation({
    mutationFn: (payload: RegisterApplicantPayload) =>
      authApi.registerApplicant(payload),
    onSuccess: () => {
      toast.success("Account created. Sign in with your email and password.");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function useRegisterRecruiter() {
  return useMutation({
    mutationFn: (payload: RegisterRecruiterPayload) =>
      authApi.registerRecruiter(payload),
    onSuccess: () => {
      toast.success(
        "Recruiter registered. Verify your email if required, then sign in.",
      );
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgetPassword({ email }),
    onSuccess: () => {
      toast.success("If an account exists, a reset link was sent.");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { token: string; newPassword: string }) =>
      authApi.resetPassword(payload),
    onSuccess: () => {
      toast.success("Password updated. You can sign in now.");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function useCreateAdminStaff() {
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => authApi.createAdmin(payload),
    onSuccess: () => {
      toast.success("Admin invited. They must sign in and set a new password.");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}
