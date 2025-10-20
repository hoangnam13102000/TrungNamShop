import { useQuery } from "@tanstack/react-query";
import { optionUseQuery } from "../../utils/common";
import { getCustomersAPI } from "./request";

// Custom React Query Hook
export default function useGetCustomers(options = {}) {
  return useQuery({
    queryKey: ["users"],
    queryFn: getCustomersAPI,
    ...optionUseQuery, 
    ...options,
    onSuccess: (data) => {
      console.log("Fetched customers:", data);
      options?.onSuccess?.(data); 
    },
    onError: (error) => {
      console.error("Fetch customers failed:", error);
      options?.onError?.(error);
    },
  });
}
