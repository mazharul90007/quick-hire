/** Matches Prisma / quick-hire-server job listing & detail payloads */

export interface IndustrySummary {
  id: string;
  name: string;
  logo?: string | null;
}

export interface SubIndustrySummary {
  id: string;
  name: string;
  industryId: string;
}

export interface RecruiterSummary {
  id: string;
  recruiterName?: string | null;
  companyName?: string | null;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyAddress?: string | null;
}

export type JobType = "REMOTE" | "ONSITE" | "HYBRID";
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTUAL"
  | "INTERNSHIP"
  | "FREELANCE";
export type JobStatus = "ACTIVE" | "PAUSED" | "DELETED";

export interface Job {
  id: string;
  recruiterId: string;
  industryId: string;
  subIndustryId: string;
  title: string | null;
  location?: string | null;
  district?: string | null;
  vacancy?: number | null;
  age?: string | null;
  salary?: string | null;
  experience?: string | null;
  education?: string[];
  additionalRequirements?: string[];
  responsibilities?: string[];
  requiredSkills?: string[];
  description?: string | null;
  benefits?: string[];
  jobType: JobType;
  employmentType: EmploymentType;
  featured?: boolean | null;
  isVerified?: boolean | null;
  tags?: string[];
  deadline?: string | null;
  status?: JobStatus;
  createdAt: string;
  updatedAt: string;
  industry?: IndustrySummary;
  subIndustry?: SubIndustrySummary;
  recruiter?: RecruiterSummary;
}

export interface Industry {
  id: string;
  name: string;
  logo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  /** Jobs linked via `industryId` */
  _count?: { jobs: number };
  subIndustries: {
    id: string;
    name: string;
    _count?: { jobs: number };
  }[];
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface JobFilters {
  searchTerm?: string;
  industryId?: string;
  subIndustryId?: string;
  jobType?: string;
  employmentType?: string;
  status?: string;
  location?: string;
  district?: string;
  featured?: boolean | string;
  /** Admin: filter by moderation flag (all statuses when paired with `allStatuses`). */
  isVerified?: boolean | string;
  recruiterId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  /** When true, do not filter by status (admin / full directory). */
  allStatuses?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  role?: string;
}

/** Nested `user` on GET /applicants/me and /recruiters/me */
export interface ProfileUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  address?: string | null;
  emailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicantProfile {
  id: string;
  userId: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  cv: string | null;
  userType: string;
  createdAt: string;
  updatedAt: string;
  user: ProfileUser;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  recruiterName: string | null;
  recruiterPhone: string | null;
  recruiterWorkEmail: string | null;
  companyName: string | null;
  companyLogo: string | null;
  companyWebsite: string | null;
  companyFacebookId: string | null;
  companyLinkedInId: string | null;
  companyAddress: string | null;
  companySize: string | null;
  industryId: string | null;
  subIndustryId: string | null;
  isVerified: boolean;
  subscriptionPlan: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: ProfileUser;
  industry: { id: string; name: string } | null;
  subIndustry: { id: string; name: string } | null;
}

export interface ApplicationRow {
  id: string;
  applicantId: string;
  jobId: string;
  /** Cloudinary URL for application CV PDF */
  cv?: string | null;
  cover_note?: string | null;
  expectedSalary?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  applicant?: {
    id: string;
    name?: string | null;
    user?: Pick<User, "id" | "email" | "name" | "image">;
  };
}

/** User row returned inside admin list/detail APIs (Prisma `userPublicSelect`). */
export interface AdminUserPublic {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  address?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminApplicantRow {
  id: string;
  name: string | null;
  address?: string | null;
  phone?: string | null;
  cv?: string | null;
  userType: string;
  createdAt: string;
  updatedAt: string;
  user: AdminUserPublic;
}

export interface AdminRecruiterRow {
  id: string;
  recruiterName: string | null;
  recruiterPhone?: string | null;
  recruiterWorkEmail?: string | null;
  companyName: string | null;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyFacebookId?: string | null;
  companyLinkedInId?: string | null;
  companyAddress?: string | null;
  companySize?: string | null;
  industryId?: string | null;
  subIndustryId?: string | null;
  isVerified: boolean;
  subscriptionPlan: string | null;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  user: AdminUserPublic;
  industry?: { id: string; name: string } | null;
  subIndustry?: { id: string; name: string } | null;
}

export interface AdminStaffRow {
  id: string;
  name: string | null;
  address?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
  user: AdminUserPublic;
}

/** Applicant / recruiter / admin profile blocks on GET /admin/users/:userId (no nested `user`). */
export type AdminApplicantProfile = Omit<AdminApplicantRow, "user">;
export type AdminRecruiterProfile = Omit<AdminRecruiterRow, "user"> & {
  companyFacebookId?: string | null;
  companyLinkedInId?: string | null;
  companyAddress?: string | null;
  companySize?: string | null;
  industryId?: string | null;
  subIndustryId?: string | null;
  isDeleted?: boolean;
};
export type AdminStaffProfile = Omit<AdminStaffRow, "user">;

/** GET /admin/users/:userId — auth user fields plus role profile when present. */
export interface AdminUserById extends AdminUserPublic {
  needPasswordChange: boolean;
  applicant: AdminApplicantProfile | null;
  recruiter: AdminRecruiterProfile | null;
  admin: AdminStaffProfile | null;
}

/** Course catalog & checkout (matches server Prisma enums / payloads). */
export type CourseAccessDuration = "MONTHS_6" | "MONTHS_12" | "UNLIMITED";

export interface CourseCatalogItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  /** Major currency amount (may be decimal, e.g. 99.99). Server converts to Stripe minor units at checkout. */
  priceAmount: number;
  currency: string;
  accessDuration: CourseAccessDuration;
  thumbnailUrl: string | null;
  createdAt: string;
}

/** Admin list row: full course + creator + purchase count. */
export interface CourseAdminRow extends CourseCatalogItem {
  isPublished: boolean;
  createdByUserId: string;
  updatedAt: string;
  stripeProductId: string | null;
  stripePriceId: string | null;
  createdBy: { id: string; email: string; name: string | null };
  _count: { purchases: number };
}

export type CoursePurchaseStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELED";

/** Applicant purchase list item from GET /applicants/me/course-purchases */
export interface CoursePurchaseRow {
  id: string;
  status: CoursePurchaseStatus;
  amount: number;
  currency: string;
  paidAt: string | null;
  receiptNumber: string | null;
  accessExpiresAt: string | null;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    accessDuration: CourseAccessDuration;
    thumbnailUrl: string | null;
  };
}
