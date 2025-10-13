import { useQuery } from "@tanstack/react-query";
import { getPromotionsAPI } from "./request";
import { optionUseQuery } from "../../../utils/common";

// Custom React Query Hook cho promotions
export default function useGetPromotions(options = {}) {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotionsAPI,
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched promotions:", data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Fetch promotions failed:", error);
      options?.onError?.(error);
    },
  });
}
