import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/lib/api-client";
import { Blog, BlogFilters } from "@/types";
import { toast } from "sonner";

export const useBlogs = (filters?: BlogFilters) => {
  return useQuery({
    queryKey: ["blogs", filters],
    queryFn: () => blogApi.getAll(filters),
  });
};

export const useBlog = (idOrSlug: string, isSlug = false) => {
  return useQuery({
    queryKey: ["blog", idOrSlug],
    queryFn: () => isSlug ? blogApi.getBySlug(idOrSlug) : blogApi.getById(idOrSlug),
    enabled: !!idOrSlug,
  });
};

export const useCreateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Blog> & { imageFile?: File }) =>
      blogApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create blog post");
    },
  });
};

export const useUpdateBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Blog> & { imageFile?: File } }) =>
      blogApi.update(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      qc.invalidateQueries({ queryKey: ["blog", data.data.id] });
      qc.invalidateQueries({ queryKey: ["blog", data.data.slug] });
      toast.success("Blog post updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update blog post");
    },
  });
};

export const useDeleteBlog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete blog post");
    },
  });
};
