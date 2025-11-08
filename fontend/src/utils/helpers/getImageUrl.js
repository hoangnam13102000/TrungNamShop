import placeholder from "../../assets/admin/logoicon1.jpg";

/**
 * Tạo URL ảnh đầy đủ từ đường dẫn tương đối.
 * Tự động nhận đúng domain cho môi trường dev/prod.
 * Có fallback sang ảnh placeholder nếu thiếu.
 */
export const getImageUrl = (value) => {
  if (!value) return placeholder;

  const BASE_URL =
    import.meta.env.VITE_BASE_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : `${window.location.origin}`);

  if (value.startsWith("http")) return value;

  // Chuẩn hóa URL: bỏ / dư và thêm /storage/
  return `${BASE_URL.replace(/\/$/, "")}/storage/${value.replace(/^\/+/, "")}`;
};
