import { useQuery } from "@tanstack/react-query";
import { createCRUD } from "./apiBase";

/**
 * Hook chung lấy dữ liệu từ bảng liên kết qua foreign key.
 * @param {string} endpoint - API endpoint, ví dụ "/api/admin/customers"
 * @param {string} foreignKey - Tên khóa ngoại, ví dụ "account_id"
 * @param {number|string} foreignId - Giá trị khóa ngoại
 */
export const useRelatedDataByForeignKey = (endpoint, foreignKey, foreignId) => {
  // Khởi tạo CRUD API từ endpoint (dùng apiBase.js)
  const api = createCRUD(endpoint);

  return useQuery({
    queryKey: [endpoint, foreignKey, foreignId],
    queryFn: async () => {
      if (!foreignId) throw new Error(`Missing ${foreignKey}`);

      // Gọi API (ví dụ: GET /api/admin/customers?account_id=1)
      const res = await api.getAll();

      // Lọc client-side theo foreignKey (tuỳ backend có hỗ trợ filter không)
      const filtered = res.filter((item) => item[foreignKey] === foreignId);

      // Chuẩn hóa avatar nếu là bảng customers (tuỳ chỉnh tuỳ bảng)
      return filtered.map((item) => ({
        ...item,
        avatar_url:
          item.avatar_url ||
          (item.avatar ? `/storage/${item.avatar}` : "/default-avatar.png"),
      }));
    },
    enabled: !!foreignId,
  });
};
