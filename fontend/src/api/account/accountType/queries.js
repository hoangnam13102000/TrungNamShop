import { useQuery } from "@tanstack/react-query";
import { getAccountTypeAPI } from "./request";
import { optionUseQuery } from "../../../utils/common";

// Custom React Query hook for account types
export default function useGetAccountType(options = {}) {
  return useQuery({
    queryKey: ["accountType"],
    queryFn: getAccountTypeAPI,
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched account types:", data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Fetch account types failed:", error);
      options?.onError?.(error);
    },
  });
}
