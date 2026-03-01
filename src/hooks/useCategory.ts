import { useMutation, useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api-client";

export const useGetAllCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await categoryApi.getAllCategories();
            return response.data;
        },
    });
};

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: (title: string) => categoryApi.createCategory(title),
    });
};
