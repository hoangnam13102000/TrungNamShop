import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const productDetailAPI = createCRUD("/product-details");

export const useProductDetails = (options) =>
  useGetAll("product-details", productDetailAPI.getAll, options);

export const useCreateProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.create, options);

export const useUpdateProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.update, options);

export const useDeleteProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.delete, options);
