export interface Job {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  companyName: string | null;
  companyLogo: string | null;
  companyDetails: string | null;
  location: string | null;
  district: string | null;
  vacancy: number | null;
  age: string | null;
  salary: string | null;
  experience: string | null;
  education: string | null;
  additionalReqirements: string[];
  responsibilities: string[];
  requiredSkills: string[];
  description: string | null;
  benefits: string[];
  jobType: "REMOTE" | "IN_PERSON" | "HYBRID";
  employmentType:
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "INTERNSHIP"
    | "TEMPORARY";
  featured: boolean;
  tags: string[];
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    title: string;
    status: string;
  };
}

export interface Category {
  id: string;
  title: string;
  status: string;
  jobs?: Job[];
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
  categoryId?: string;
  jobType?: string;
  employmentType?: string;
  location?: string;
  district?: string;
  featured?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
}
