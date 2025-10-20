import { useQuery } from "@tanstack/react-query";
import { optionUseQuery } from "../../utils/common";
import { getBrandsAPI } from "./request"; 

// Custom React Query Hook
export default function useGetBrands(options = {}) {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrandsAPI, 
    ...optionUseQuery, 
    ...options, 
    onSuccess: (data) => {
      console.log("Fetched brands:", data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Fetch brands failed:", error);
      options?.onError?.(error);
    },
  });
}