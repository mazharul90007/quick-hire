import { useMutation } from "@tanstack/react-query";
import { applicationApi } from "@/lib/api-client";

export const useCreateApplication = () => {
    return useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: (payload: any) => applicationApi.createApplication(payload),
    });
};
