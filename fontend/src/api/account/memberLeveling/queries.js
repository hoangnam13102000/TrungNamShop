import { useQuery } from "@tanstack/react-query";
import { getAccountLevelingAPI } from "./request";
import { optionUseQuery } from "../../../utils/common";

// Custom React Query Hook cho promotions
export default function useGetAccountLeveling(options = {}) {
  return useQuery({
    queryKey: ["accountLeveling"],
    queryFn: getAccountLevelingAPI,
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched account leveling:", data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Fetch account leveling failed:", error);
      options?.onError?.(error);
    },
  });
}