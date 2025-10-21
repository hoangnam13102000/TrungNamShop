
import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const productsAPI = createCRUD("/products");

export const useProducts = (options) => useGetAll("products", productsAPI.getAll, options);

export const useCreateProduct = (options) => useMutate("products", productsAPI.create, options);
export const useUpdateProduct = (options) => useMutate("products", productsAPI.update, options);
export const useDeleteProduct = (options) => useMutate("products", productsAPI.delete, options);
