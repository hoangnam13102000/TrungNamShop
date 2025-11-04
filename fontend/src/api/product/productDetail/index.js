import { createCRUD } from "../../hooks/apiBase";
import { useQuery } from "@tanstack/react-query";
import { useGetAll, useMutate } from "../../hooks/useBaseQuery";

const productDetailAPI = createCRUD("/product-details");
const productImageAPI = createCRUD("/product-images");

export const useProductDetailById = (productId) => {
  return useQuery({
    queryKey: ["product-detail", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Missing product ID");

      const allDetails = await productDetailAPI.getAll();

      const detail = allDetails.find(item => item.product?.id === productId);

      if (!detail) return null; // fallback: không tìm thấy

      
      const allImages = await productImageAPI.getAll();

      
      const images = allImages.filter(img => img.product_id === productId);

      const finalImages = images.length > 0
        ? images
        : detail.product?.primary_image
        ? [detail.product.primary_image]
        : [];

      return {
        ...detail,
        images: finalImages,
      };
    },
    enabled: !!productId,
  });
};



export const useProductDetails = (options) =>
  useGetAll("product-details", productDetailAPI.getAll, options);

export const useCreateProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.create, options);

export const useUpdateProductDetail = (options) =>
  useMutate(
    "product-details",
    async ({ id, data }) => {
      if (!id) throw new Error("Missing ID for update");
      return await productDetailAPI.update(id, data);
    },
    options
  );

// export const useDeleteProductDetail = (options) =>
//   useMutate("product-details", productDetailAPI.delete, options);
