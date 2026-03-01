import { useQuery } from "@tanstack/react-query";
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
