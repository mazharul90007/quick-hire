export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  district: string;
  employmentType: string;
  jobType: string;
  description: string;
  category: {
    title: string;
  };
  tags: string[];
}

export interface Category {
  id: string;
  title: string;
  jobs: Job[];
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
