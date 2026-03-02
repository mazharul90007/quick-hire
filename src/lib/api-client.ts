import { Job, Category, PaginatedData } from "@/types";
import { api } from "./axiosInstance";

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

//================User Api===================

export const userApi = {};

//=============Category Api=================

export const categoryApi = {
  getAllCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },
  createCategory: async (title: string) => {
    const response = await api.post<ApiResponse<Category>>("/categories", {
      title,
    });
    return response.data;
  },
};

//==============Job Api====================
export const jobApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllJobs: async (params?: Record<string, any>) => {
    const response = await api.get<ApiResponse<PaginatedData<Job>>>("/jobs", {
      params,
    });
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createJob: async (payload: any) => {
    const response = await api.post<ApiResponse<Job>>(
      "/jobs/create-job",
      payload,
    );
    return response.data;
  },
  getSingleJob: async (id: string) => {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data;
  },
};
//==============Application Api==================
export const applicationApi = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createApplication: async (payload: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.post<ApiResponse<any>>("/applications", payload);
    return response.data;
  },
};
