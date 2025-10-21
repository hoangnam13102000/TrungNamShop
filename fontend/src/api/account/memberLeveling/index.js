import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const  memberLevelingAPI = createCRUD("/account-leveling");

export const useMemberLevelings = (options) => useGetAll("memberLevelings", memberLevelingAPI.getAll, options);

export const useCreateMemberLeveling = (options) => useMutate("memberLevelings", memberLevelingAPI.create, options);
export const useUpdateMemberLeveling = (options) => useMutate("memberLevelings", memberLevelingAPI.update, options);
export const useDeleteMemberLeveling = (options) => useMutate("memberLevelings", memberLevelingAPI.delete, options);