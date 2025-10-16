import { useQuery } from "@tanstack/react-query";
import { getPositionsAPI } from "./request";
import { optionUseQuery } from "../../../utils/common";

// Custom React Query Hook for positions
export default function useGetPositions(options = {}) {
  return useQuery({
    queryKey: ["positions"],
    queryFn: getPositionsAPI,
    ...optionUseQuery,
    ...options,
    onSuccess: (data) => {
      console.log("Fetched positions:", data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Fetch positions failed:", error);
      options?.onError?.(error);
    },
  });
}
