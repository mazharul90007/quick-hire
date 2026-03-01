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
};
//==============Application Api==================
