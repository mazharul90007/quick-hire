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

//==============Job Api=====================

//==============Application Api==================
