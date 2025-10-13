import { useQuery } from "@tanstack/react-query";
import { getStoresAPI } from "./request";
import { optionUseQuery } from "../../utils/common";

// Custom React Query Hook
export default function useGetStores(options = {}) {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStoresAPI,
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched stores:", data);
      options?.onSuccess?.(data); 
    },
    onError: (error) => {
      console.error("Fetch stores failed:", error);
      options?.onError?.(error);
    },
  });
}
