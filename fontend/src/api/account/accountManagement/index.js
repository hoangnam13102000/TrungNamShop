import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const accountsAPI = createCRUD("/accounts");

export const useAccounts = (options) => useGetAll("accounts", accountsAPI.getAll, options);

export const useCreateAccount = (options) => useMutate("accounts", accountsAPI.create, options);
export const useUpdateAccount = (options) => useMutate("accounts", accountsAPI.update, options);
export const useDeleteAccount = (options) => useMutate("accounts", accountsAPI.delete, options);