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
  getAllJobs: async (params?: Record<string, string | number | boolean>) => {
    const response = await api.get<ApiResponse<PaginatedData<Job>>>("/jobs", {
      params,
    });
    return response.data;
  },
};
//==============Application Api==================
