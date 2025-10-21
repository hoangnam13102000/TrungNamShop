import { createCRUD } from "../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../api/hook/useBaseQuery";

const customersAPI = createCRUD("/customers");

export const useCustomers = (options) => useGetAll("customers", customersAPI.getAll, options);

export const useCreateCustomer = (options) => useMutate("customers", customersAPI.create, options);
export const useUpdateCustomer = (options) => useMutate("customers", customersAPI.update, options);
// export const useDeleteCustomer = (options) => useMutate("customers", customersAPI.delete, options);