import { useQuery } from "@tanstack/react-query";
import { industryApi } from "@/lib/api-client";

export const useGetIndustries = () => {
  return useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const res = await industryApi.getAll();
      return res.data;
    },
  });
};
