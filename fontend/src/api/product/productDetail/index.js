import { createCRUD } from "../../hooks/apiBase";
import { useQuery } from "@tanstack/react-query";
import { useGetAll, useMutate } from "../../hooks/useBaseQuery";

// Tạo instance API
const productDetailAPI = createCRUD("/product-details");

// --- SỬA LẠI HOOK NÀY: Dùng getOne thay vì tự filter ---
export const useProductDetailById = (productId) => {
  return useQuery({
    queryKey: ["product-detail", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Missing product ID");

      // Gọi hàm getOne từ file createCRUD của bạn
      // Backend Laravel (Resource) trả về { data: { ... } }
      // Hàm getOne của bạn đã xử lý return res.data?.data rồi, nên ở đây lấy được object chuẩn luôn.
      const detail = await productDetailAPI.getOne(productId);

      return detail;
    },
    enabled: !!productId, // Chỉ chạy khi có ID
    staleTime: 0,         // Luôn fetch mới khi component mount lại (để lấy dữ liệu mới nhất khi edit)
    refetchOnWindowFocus: false,
  });
};

// --- CÁC HOOK KHÁC ---

export const useProductDetails = (options) =>
  useGetAll("product-details", productDetailAPI.getAll, options);

export const useCreateProductDetail = (options) =>
  useMutate("product-details", productDetailAPI.create, options);

export const useUpdateProductDetail = (options) =>
  useMutate(
    "product-details",
    async ({ id, data }) => {
      if (!id) throw new Error("Missing ID for update");
      // Gọi hàm update từ file createCRUD
      return await productDetailAPI.update(id, data);
    },
    options
  );

// export const useDeleteProductDetail = (options) =>
//   useMutate("product-details", productDetailAPI.delete, options);