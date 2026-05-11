import {
  Job,
  Industry,
  PaginatedData,
  ApiResponse,
  ApplicationRow,
  AdminApplicantRow,
  AdminRecruiterRow,
  AdminStaffRow,
  AdminUserById,
  AdminUserPublic,
  ApplicantProfile,
  RecruiterProfile,
  CourseCatalogItem,
  CourseAdminRow,
  CoursePurchaseRow,
  Blog,
  BlogFilters,
} from "@/types";
import { api } from "./axiosInstance";

export type { ApiResponse };

// ============== Blogs ==============

export const blogApi = {
  getAll: async (params?: BlogFilters) => {
    const response = await api.get<ApiResponse<Blog[]>>("/blogs", { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/slug/${slug}`);
    return response.data;
  },
  create: async (payload: Partial<Blog> & { imageFile?: File }) => {
    const formData = new FormData();
    const { imageFile, ...data } = payload;
    
    formData.append("data", JSON.stringify(data));
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    
    const response = await api.post<ApiResponse<Blog>>(
      "/blogs/create-blog",
      formData,
    );
    return response.data;
  },
  update: async (id: string, payload: Partial<Blog> & { imageFile?: File }) => {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { imageFile, id: _id, createdAt, updatedAt, image, imagePublicId, ...data } = payload;
    
    formData.append("data", JSON.stringify(data));
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    
    const response = await api.patch<ApiResponse<Blog>>(`/blogs/${id}`, formData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<Blog>>(`/blogs/${id}`);
    return response.data;
  },
};


// ============== Industries (replaces categories for jobs) ==============

export const industryApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Industry[]>>("/industries");
    return response.data;
  },
  create: async (payload: { name: string; logo: File }) => {
    const formData = new FormData();
    formData.append("name", payload.name.trim());
    formData.append("logo", payload.logo);
    const response = await api.post<ApiResponse<Industry>>(
      "/industries/create-industry",
      formData,
    );
    return response.data;
  },
  update: async (
    id: string,
    payload: { name?: string; logoFile?: File },
  ) => {
    if (payload.logoFile) {
      const formData = new FormData();
      if (payload.name !== undefined && payload.name.length > 0) {
        formData.append("name", payload.name.trim());
      }
      formData.append("logo", payload.logoFile);
      const response = await api.patch<ApiResponse<Industry>>(
        `/industries/${id}`,
        formData,
      );
      return response.data;
    }
    if (payload.name === undefined) {
      throw new Error("Update requires a name or a logo file");
    }
    const response = await api.patch<ApiResponse<Industry>>(
      `/industries/${id}`,
      { name: payload.name.trim() },
    );
    return response.data;
  },
};

export interface SubIndustry {
  id: string;
  name: string;
  industryId: string;
}

export const subIndustryApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<SubIndustry[]>>(
      "/sub-industries",
    );
    return response.data;
  },
  create: async (payload: { name: string; industryId: string }) => {
    const response = await api.post<ApiResponse<SubIndustry>>(
      "/sub-industries/create-sub-industry",
      payload,
    );
    return response.data;
  },
  update: async (id: string, payload: { name?: string; industryId?: string }) => {
    const response = await api.patch<ApiResponse<SubIndustry>>(
      `/sub-industries/${id}`,
      payload,
    );
    return response.data;
  },
};

// ============== Jobs ==============

export const jobApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllJobs: async (params?: Record<string, any>) => {
    const response = await api.get<ApiResponse<PaginatedData<Job>>>("/jobs", {
      params,
    });
    return response.data;
  },
  /** Recruiter session cookie required */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createJob: async (payload: any) => {
    const response = await api.post<ApiResponse<Job>>("/jobs", payload);
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateJob: async (id: string, payload: any) => {
    const response = await api.patch<ApiResponse<Job>>(`/jobs/${id}`, payload);
    return response.data;
  },
  getSingleJob: async (id: string) => {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data;
  },
  smartSearch: async (q: string) => {
    const response = await api.get<ApiResponse<{ aiMessage: string, jobs: Job[] }>>("/jobs/ai-search", {
      params: { q }
    });
    return response.data;
  },
};

// ============== Applications ==============

export const applicationApi = {
  /**
   * Applicant session + cookies required.
   * Multipart: `cv` (PDF file) + `data` (JSON string: jobId, optional cover_note, expectedSalary).
   */
  createApplication: async (payload: {
    jobId: string;
    cv: File;
    cover_note?: string;
    expectedSalary?: string;
  }) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        jobId: payload.jobId,
        cover_note: payload.cover_note,
        expectedSalary: payload.expectedSalary,
      }),
    );
    formData.append("cv", payload.cv);
    const response = await api.post<ApiResponse<ApplicationRow>>(
      "/applications",
      formData,
    );
    return response.data;
  },
  /**
   * Admin / recruiter / applicant — server scopes rows by role.
   * API returns top-level `meta` + `data` array (not nested like jobs).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get<
      ApiResponse<ApplicationRow[]> & {
        meta?: { page: number; limit: number; total: number };
      }
    >("/applications", { params });
    const body = response.data;
    return {
      data: Array.isArray(body.data) ? body.data : [],
      meta: body.meta ?? { page: 1, limit: 10, total: 0 },
    };
  },
  getOne: async (id: string) => {
    const response = await api.get<ApiResponse<ApplicationRow>>(
      `/applications/${id}`,
    );
    return response.data;
  },
};

// ============== Admin (ADMIN / SUPER_ADMIN session + cookie) ==============

type AdminListMeta = { page: number; limit: number; total: number };

/** Multipart file parts for PATCH .../me — `image` maps to User.image (avatar for all roles). */
export type ProfileUploadFiles = {
  image?: File;
  companyLogo?: File;
  cv?: File;
};

function appendProfileFiles(fd: FormData, files?: ProfileUploadFiles) {
  if (!files) return;
  if (files.image) fd.append("image", files.image);
  if (files.companyLogo) fd.append("companyLogo", files.companyLogo);
  if (files.cv) fd.append("cv", files.cv);
}

function normalizeAdminList<T>(
  body: ApiResponse<T[]> & { meta?: AdminListMeta },
): { data: T[]; meta: AdminListMeta } {
  return {
    data: Array.isArray(body.data) ? body.data : [],
    meta: body.meta ?? { page: 1, limit: 10, total: 0 },
  };
}

export const adminApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getApplicants: async (params?: Record<string, any>) => {
    const response = await api.get<
      ApiResponse<AdminApplicantRow[]> & { meta?: AdminListMeta }
    >("/admin/applicants", { params });
    return normalizeAdminList(response.data);
  },
  getApplicant: async (id: string, params?: { includeDeleted?: string }) => {
    const response = await api.get<ApiResponse<AdminApplicantRow>>(
      `/admin/applicants/${id}`,
      { params },
    );
    return response.data;
  },
  /**
   * Multipart: `data` (JSON) + optional `image` / `cv` (matches server multer + parse chain).
   */
  patchApplicant: async (
    id: string,
    payload: Record<string, unknown>,
    files?: Pick<ProfileUploadFiles, "image" | "cv">,
  ) => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));
    appendProfileFiles(fd, files);
    const response = await api.patch<ApiResponse<AdminApplicantRow>>(
      `/admin/applicants/${id}`,
      fd,
    );
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRecruiters: async (params?: Record<string, any>) => {
    const response = await api.get<
      ApiResponse<AdminRecruiterRow[]> & { meta?: AdminListMeta }
    >("/admin/recruiters", { params });
    return normalizeAdminList(response.data);
  },
  getRecruiter: async (id: string, params?: { includeDeleted?: string }) => {
    const response = await api.get<ApiResponse<AdminRecruiterRow>>(
      `/admin/recruiters/${id}`,
      { params },
    );
    return response.data;
  },
  /** Multipart: `data` (JSON) + optional `image` / `companyLogo`. */
  patchRecruiter: async (
    id: string,
    payload: Record<string, unknown>,
    files?: Pick<ProfileUploadFiles, "image" | "companyLogo">,
  ) => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));
    appendProfileFiles(fd, files);
    const response = await api.patch<ApiResponse<AdminRecruiterRow>>(
      `/admin/recruiters/${id}`,
      fd,
    );
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStaffAdmins: async (params?: Record<string, any>) => {
    const response = await api.get<
      ApiResponse<AdminStaffRow[]> & { meta?: AdminListMeta }
    >("/admin/admins", { params });
    return normalizeAdminList(response.data);
  },
  getStaffAdmin: async (id: string, params?: { includeDeleted?: string }) => {
    const response = await api.get<ApiResponse<AdminStaffRow>>(
      `/admin/admins/${id}`,
      { params },
    );
    return response.data;
  },
  /** Multipart: `data` (JSON) + optional `image`. */
  patchAdminProfile: async (
    id: string,
    payload: Record<string, unknown>,
    files?: Pick<ProfileUploadFiles, "image">,
  ) => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));
    appendProfileFiles(fd, files);
    const response = await api.patch<ApiResponse<AdminStaffRow>>(
      `/admin/admins/${id}`,
      fd,
    );
    return response.data;
  },
  getUserById: async (
    userId: string,
    params?: { includeDeleted?: string },
  ) => {
    const response = await api.get<ApiResponse<AdminUserById>>(
      `/admin/users/${userId}`,
      { params },
    );
    return response.data;
  },
  updateUserStatus: async (
    userId: string,
    payload: { status: "ACTIVE" | "BLOCKED" | "DELETED" },
  ) => {
    const response = await api.patch<ApiResponse<AdminUserPublic>>(
      `/admin/users/${userId}/status`,
      payload,
    );
    return response.data;
  },
  softDeleteUser: async (userId: string) => {
    const response = await api.delete<ApiResponse<AdminUserPublic>>(
      `/admin/users/${userId}`,
    );
    return response.data;
  },
  /** ADMIN / SUPER_ADMIN — GET /admin/me */
  getMyProfile: async () => {
    const response = await api.get<ApiResponse<unknown>>("/admin/me");
    return response.data;
  },
  /** ADMIN / SUPER_ADMIN — PATCH /admin/me (multipart). */
  updateMyProfile: async (
    data: Record<string, unknown>,
    files?: ProfileUploadFiles,
  ) => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    appendProfileFiles(fd, files);
    const response = await api.patch<ApiResponse<unknown>>("/admin/me", fd);
    return response.data;
  },
  /** Sellable courses (draft + published). */
  getCourses: async () => {
    const response = await api.get<ApiResponse<CourseAdminRow[]>>("/admin/courses");
    return response.data;
  },
  createCourse: async (payload: {
    title: string;
    slug?: string;
    description?: string | null;
    priceAmount: number;
    currency?: string;
    accessDuration?: CourseCatalogItem["accessDuration"];
    thumbnailUrl?: string | null;
    isPublished?: boolean;
  }) => {
    const response = await api.post<ApiResponse<CourseAdminRow>>(
      "/admin/courses",
      payload,
    );
    return response.data;
  },
  updateCourse: async (
    courseId: string,
    payload: Partial<{
      title: string;
      slug: string;
      description: string | null;
      priceAmount: number;
      currency: string;
      accessDuration: CourseCatalogItem["accessDuration"];
      thumbnailUrl: string | null;
      isPublished: boolean;
    }>,
  ) => {
    const response = await api.patch<ApiResponse<CourseAdminRow>>(
      `/admin/courses/${courseId}`,
      payload,
    );
    return response.data;
  },
  deleteCourse: async (courseId: string) => {
    const response = await api.delete<ApiResponse<CourseAdminRow | null>>(
      `/admin/courses/${courseId}`,
    );
    return response.data;
  },
};

export const recruiterApi = {
  getMyProfile: async () => {
    const response = await api.get<ApiResponse<RecruiterProfile>>("/recruiters/me");
    return response.data.data;
  },
  updateMyProfile: async (
    data: Record<string, unknown>,
    files?: ProfileUploadFiles,
  ) => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    appendProfileFiles(fd, files);
    const response = await api.patch<ApiResponse<RecruiterProfile>>(
      "/recruiters/me",
      fd,
    );
    return response.data.data;
  },
};

export const applicantApi = {
  getMyProfile: async () => {
    const response = await api.get<ApiResponse<ApplicantProfile>>("/applicants/me");
    return response.data.data;
  },
  updateMyProfile: async (
    data: Record<string, unknown>,
    files?: ProfileUploadFiles,
  ) => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    appendProfileFiles(fd, files);
    const response = await api.patch<ApiResponse<ApplicantProfile>>(
      "/applicants/me",
      fd,
    );
    return response.data.data;
  },
  /** Stripe Checkout: returns hosted payment URL. */
  startCourseCheckout: async (courseId: string) => {
    const response = await api.post<
      ApiResponse<{ checkoutUrl: string; purchaseId: string }>
    >("/applicants/me/course-checkout", { courseId });
    return response.data;
  },
  /** Dashboard: orders + access info. */
  getCoursePurchases: async () => {
    const response = await api.get<ApiResponse<CoursePurchaseRow[]>>(
      "/applicants/me/course-purchases",
    );
    return response.data;
  },
  /** Binary PDF; trigger download in the UI. */
  downloadCourseReceiptPdf: async (purchaseId: string) => {
    const response = await api.get<Blob>(
      `/applicants/me/course-purchases/${purchaseId}/receipt`,
      { responseType: "blob" },
    );
    return response.data;
  },
};

// ============== Courses (public catalog; no auth) ==============

export const courseApi = {
  listPublished: async () => {
    const response = await api.get<ApiResponse<CourseCatalogItem[]>>("/courses");
    return response.data;
  },
  getPublishedOne: async (idOrSlug: string) => {
    const response = await api.get<ApiResponse<CourseCatalogItem>>(
      `/courses/${encodeURIComponent(idOrSlug)}`,
    );
    return response.data;
  },
};

// ============== Auth (REST; session still via Better Auth after login) ==============

export type RegisterApplicantPayload = {
  email: string;
  password: string;
  applicant: {
    name?: string;
    address?: string;
    phone?: string;
  };
};

export type RegisterRecruiterPayload = {
  email: string;
  password: string;
  recruiter: {
    recruiterName?: string;
    recruiterPhone?: string;
    recruiterWorkEmail?: string;
    companyName?: string;
    companyWebsite?: string;
    companyFacebookId?: string;
    companyLinkedInId?: string;
    companySize?: string;
    companyAddress?: string;
    industryId?: string;
    subIndustryId?: string;
  };
};

export type CreateAdminPayload = {
  password: string;
  admin: {
    name?: string;
    email: string;
    address?: string;
    phone?: string;
  };
};

export const authApi = {
  registerApplicant: async (payload: RegisterApplicantPayload) => {
    const response = await api.post<ApiResponse<unknown>>(
      "/auth/register-applicant",
      payload,
    );
    return response.data;
  },
  registerRecruiter: async (payload: RegisterRecruiterPayload) => {
    const response = await api.post<ApiResponse<unknown>>(
      "/auth/register-recruiter",
      payload,
    );
    return response.data;
  },
  forgetPassword: async (payload: { email: string }) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/forget-password",
      payload,
    );
    return response.data;
  },
  resetPassword: async (payload: { token: string; newPassword: string }) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/reset-password",
      payload,
    );
    return response.data;
  },
  /** SUPER_ADMIN session cookie required */
  createAdmin: async (payload: CreateAdminPayload) => {
    const response = await api.post<ApiResponse<unknown>>(
      "/auth/create-admin",
      payload,
    );
    return response.data;
  },
};
