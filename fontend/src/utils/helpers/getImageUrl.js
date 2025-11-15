import placeholder from "../../assets/admin/logoicon1.jpg";

/**
 * Tạo URL ảnh đầy đủ từ đường dẫn tương đối hoặc object.
 * Tự động nhận đúng domain cho môi trường dev/prod.
 * Có fallback sang ảnh placeholder nếu thiếu hoặc sai.
 */
export const getImageUrl = (value) => {
  if (!value) return placeholder;

  // Nếu value là object (VD: { url: "abc.jpg" })
  if (typeof value === "object" && value !== null) {
    value = value.url || value.path || value.src || "";
  }

  // Nếu không phải chuỗi → fallback
  if (typeof value !== "string" || value.trim() === "") {
    return placeholder;
  }

  const BASE_URL =
    import.meta.env.VITE_BASE_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : `${window.location.origin}`);

  // Nếu là URL đầy đủ
  if (value.startsWith("http")) return value;

  // Chuẩn hóa đường dẫn storage
  return `${BASE_URL.replace(/\/$/, "")}/storage/${value.replace(/^\/+/, "")}`;
};
