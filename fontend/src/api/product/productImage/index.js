
import { createCRUD } from "../../../api/hook/apiBase";
import { useGetAll, useMutate } from "../../../api/hook/useBaseQuery";

const product_imagesAPI = createCRUD("/product-images");

export const useProductImages = (options) => useGetAll("product-images", product_imagesAPI.getAll, options);
export const useCreateProductImage = (options) => useMutate("product-images", product_imagesAPI.create, options);
export const useUpdateProductImage = (options) => useMutate("product-images", product_imagesAPI.update, options);
export const useDeleteProductImage = (options) => useMutate("product-images", product_imagesAPI.delete, options);
