import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";


const accountTypesAPI = createCRUD("/account-types");

export const useAccountTypes = (options) => useGetAll("account-types", accountTypesAPI.getAll, options);

export const useCreateAccountType = (options) => useMutate("account-types", accountTypesAPI.create, options);
export const useUpdateAccountType = (options) => useMutate("account-types", accountTypesAPI.update, options);
export const useDeleteAccountType = (options) => useMutate("account-types", accountTypesAPI.delete, options);
