import { useQuery } from "@tanstack/react-query";
import { getAccountAPI } from "./request";
import { optionUseQuery } from "../../../utils/common";

// Custom React Query hook for accounts
export default function useGetAccount(options = {}) {
  return useQuery({
    queryKey: ["account"], 
    queryFn: getAccountAPI, 
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched accounts:", data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Fetch accounts failed:", error);
      options?.onError?.(error);
    },
  });
}
