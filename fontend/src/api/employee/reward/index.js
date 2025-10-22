import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const rewardsAPI = createCRUD("/rewards");

export const useRewards = (options) => useGetAll("rewards", rewardsAPI.getAll, options);

export const useCreateReward = (options) => useMutate("rewards", rewardsAPI.create, options);
export const useUpdateReward = (options) => useMutate("rewards", rewardsAPI.update, options);
export const useDeleteReward = (options) => useMutate("rewards", rewardsAPI.delete, options);