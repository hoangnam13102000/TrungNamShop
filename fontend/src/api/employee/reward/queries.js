import { useQuery } from "@tanstack/react-query";
import { getRewardsAPI } from "./request";
import { optionUseQuery } from "../../../utils/common";

// Custom React Query Hook for rewards
export default function useGetRewards(options = {}) {
  return useQuery({
    queryKey: ["rewards"],
    queryFn: getRewardsAPI,
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched rewards:", data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Fetch rewards failed:", error);
      options?.onError?.(error);
    },
  });
}
