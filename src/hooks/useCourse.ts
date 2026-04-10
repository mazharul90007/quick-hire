"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminApi,
  applicantApi,
  courseApi,
} from "@/lib/api-client";
import type { CourseAdminRow, CourseCatalogItem } from "@/types";

/** Public storefront list (no session). */
export function usePublishedCourses() {
  return useQuery({
    queryKey: ["courses", "published"],
    queryFn: async () => {
      const res = await courseApi.listPublished();
      return res.data ?? [];
    },
  });
}

/** Admin: all courses including drafts. */
export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const res = await adminApi.getCourses();
      return res.data ?? [];
    },
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof adminApi.createCourse>[0]) =>
      adminApi.createCourse(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["courses", "published"] });
      toast.success("Course created");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: Parameters<typeof adminApi.updateCourse>[1];
    }) => adminApi.updateCourse(courseId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["courses", "published"] });
      toast.success("Course updated");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => adminApi.deleteCourse(courseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["courses", "published"] });
      toast.success("Course removed or unpublished");
    },
    onError: (e: unknown) => toast.error(extractErr(e)),
  });
}

/** Logged-in applicant: order history + receipts. */
export function useMyCoursePurchases(enabled = true) {
  return useQuery({
    queryKey: ["applicant", "course-purchases"],
    queryFn: async () => {
      const res = await applicantApi.getCoursePurchases();
      return res.data ?? [];
    },
    enabled,
  });
}

/** Redirect browser to Stripe Checkout. */
export function useCourseCheckout() {
  return useMutation({
    mutationFn: (courseId: string) => applicantApi.startCourseCheckout(courseId),
    onSuccess: (res) => {
      const url = res.data?.checkoutUrl;
      if (url) window.location.href = url;
      else toast.error("No checkout URL returned");
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

export type { CourseAdminRow, CourseCatalogItem };
