import { createCRUD } from "../../hook/apiBase";
import { useQuery } from "@tanstack/react-query";
import { useGetAll, useMutate } from "../../hook/useBaseQuery";

const productDetailAPI = createCRUD("/product-details");
const productImageAPI = createCRUD("/product-images");

export const useProductDetailById = (productId) => {
  return useQuery({
    queryKey: ["product-detail", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Missing product ID");

      // 1️⃣ Lấy toàn bộ product-details
      const allDetails = await productDetailAPI.getAll();

      // 2️⃣ Tìm chi tiết sản phẩm theo product_id
      const found = allDetails.find(
        (item) => item.product?.id === productId
      );
      if (!found) throw new Error("Không tìm thấy chi tiết sản phẩm.");

      // 3️⃣ Lấy danh sách ảnh của sản phẩm
      const allImages = await productImageAPI.getAll();
      const productImages = allImages.filter(
        (img) => img.product_id === productId
      );

      // 4️⃣ Nếu không có ảnh thì fallback về primary_image trong product
      const images =
        productImages.length > 0
          ? productImages
          : found.product?.primary_image
          ? [found.product.primary_image]
          : [];

      // 5️⃣ Trả về object gộp
      return {
        ...found,
        images,
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

export const useDeleteProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.delete, options);
