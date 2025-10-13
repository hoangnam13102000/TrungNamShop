import { useQuery } from "@tanstack/react-query";
import { getWareHouse } from "./request";
import { optionUseQuery } from "../../utils/common";

// Custom React Query Hook
export default function useGetWareHouse(options = {}) {
  return useQuery({
    queryKey: ["wareHouse"],
    queryFn: getWareHouse,
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched wareHouse:", data);
      options?.onSuccess?.(data); 
    },
    onError: (error) => {
      console.error("Fetch wareHouse failed:", error);
      options?.onError?.(error);
    },
  });
}
