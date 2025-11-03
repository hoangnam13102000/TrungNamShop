import { createCRUD } from "../../api/hook/apiBase";
import { useQuery } from "@tanstack/react-query";
import { useGetAll, useMutate } from "../../api/hook/useBaseQuery";
const customersAPI = createCRUD("/customers");


export const useCustomerByAccountId = (accountId) => {
  return useQuery({
    queryKey: ["customer-by-account", accountId],
    queryFn: async () => {
      if (!accountId) throw new Error("Missing accountId");

      // gọi API custom
      const customer = await customersAPI.getByAccountId(accountId);

      // Chuẩn hóa avatar URL
      const avatarUrl =
        customer?.avatar_url ||
        (customer?.avatar ? `/storage/${customer.avatar}` : "/default-avatar.png");

      return {
        ...customer,
        avatar_url: avatarUrl,
      };
    },
    enabled: !!accountId, // chỉ gọi khi có accountId
  });
};


export const useCustomers = (options) => useGetAll("customers", customersAPI.getAll, options);

export const useCreateCustomer = (options) => useMutate("customers", customersAPI.create, options);
export const useUpdateCustomer = (options) => useMutate("customers", customersAPI.update, options);
// export const useDeleteCustomer = (options) => useMutate("customers", customersAPI.delete, options);