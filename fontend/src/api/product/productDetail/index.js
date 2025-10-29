import { createCRUD } from "./apiProduct";
import { useGetAll, useMutate } from "./useProductQuery";

const productDetailAPI = createCRUD("/product-details");

export const useProductDetails = (options) =>
  useGetAll("product-details", productDetailAPI.getAll, options);

export const useCreateProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.create, options);

export const useUpdateProductDetail = (options) =>
  useMutate(
    "product-details",
    async ({ id, data }) => {
      console.log("🧩 useUpdateProductDetail variables:", { id, data });
      if (!id) throw new Error("Missing ID for update");
      return await productDetailAPI.update(id, data);
    },
    options
  );

export const useDeleteProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.delete, options);
