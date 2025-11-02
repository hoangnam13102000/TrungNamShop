import { createCRUD } from "../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../api/hook/useBaseQuery";
import { useQuery } from "@tanstack/react-query";
import { getImageUrl } from "../../utils/getImageUrl";
import placeholder from "../../assets/admin/logoicon1.jpg";

export const useCustomerDetailById = (customerId, options = {}) => {
  return useQuery({
    queryKey: ["customer-detail", customerId],
    queryFn: async () => {
      if (!customerId) throw new Error("Missing customer ID");

      const customer = await customersAPI.getById(customerId); // GET /customers/:id

      if (!customer) return null;

      return {
        ...customer,
        avatar: customer.avatar ? getImageUrl(customer.avatar) : placeholder,
        birth_date: customer.birth_date || null,
      };
    },
    enabled: !!customerId,
    ...options,
  });
};

const customersAPI = createCRUD("/customers");

export const useCustomers = (options) => useGetAll("customers", customersAPI.getAll, options);

export const useCreateCustomer = (options) => useMutate("customers", customersAPI.create, options);
export const useUpdateCustomer = (options) => useMutate("customers", customersAPI.update, options);
// export const useDeleteCustomer = (options) => useMutate("customers", customersAPI.delete, options);