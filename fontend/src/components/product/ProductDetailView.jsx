import React from "react";
import { getImageUrl } from "../../utils/getImageUrl";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const EXCLUDE_FIELDS = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "product_image",
  "product_name",
  "price_label",
];

// Từ điển tiếng Việt cho tất cả bảng
const FIELD_LABELS = {
  // Sản phẩm
  product: "Thông tin sản phẩm",
  name: "Tên sản phẩm",
  description: "Mô tả",
  status: "Trạng thái",
  price: "Giá bán",
  stock_quantity: "Tồn kho",
  color: "Màu sắc",
  brand: "Thương hiệu",
  primary_image: "Ảnh sản phẩm chính",

  // Thông tin chung
  general_information: "Thông tin chung",
  design: "Thiết kế",
  material: "Chất liệu",
  dimensions: "Kích thước",
  weight: "Khối lượng",
  launch_time: "Ngày ra mắt",

  // Màn hình
  screen: "Màn hình",
  display_technology: "Công nghệ hiển thị",
  resolution: "Độ phân giải",
  screen_size: "Kích thước màn hình",
  max_brightness: "Độ sáng tối đa",
  glass_protection: "Kính bảo vệ",

  // Camera
  rear_camera: "Camera sau",
  front_camera: "Camera trước",
  aperture: "Khẩu độ",
  video_capability: "Quay video",
  features: "Tính năng",

  // Bộ nhớ
  memory: "Bộ nhớ",
  ram: "RAM",
  internal_storage: "Bộ nhớ trong",
  memory_card_slot: "Khe thẻ nhớ",

  // Hệ thống
  operating_system: "Hệ điều hành",
  processor: "Bộ xử lý",
  cpu_speed: "Tốc độ CPU",
  gpu: "GPU",

  // Pin & Sạc
  battery: "Pin & Sạc",
  battery_capacity: "Dung lượng pin",
  charging_port: "Cổng sạc",
  charging: "Công nghệ sạc",

  // Tiện ích
  utility: "Tiện ích",
  advanced_security: "Bảo mật nâng cao",
  special_features: "Tính năng đặc biệt",
  water_dust_resistance: "Chống nước / bụi",

  // Kết nối
  communication: "Kết nối & Giao tiếp",
  nfc: "NFC",
  sim_slot: "Khe SIM",
  mobile_network: "Mạng di động",
  gps: "Định vị GPS",
};

/** ===============================
 * Hàm hiển thị giá trị từng field
 * =============================== */
const renderValue = (key, value) => {
  if (value === null || value === undefined) return "-";

  // 🟢 Trạng thái bán hàng (true / false)
  if (key === "status") {
    return value ? (
      <span className="flex items-center gap-2 text-green-600 font-semibold">
        <FaCheckCircle className="text-lg" />
        Đang bán
      </span>
    ) : (
      <span className="flex items-center gap-2 text-red-500 font-semibold">
        <FaTimesCircle className="text-lg" />
        Ngừng bán
      </span>
    );
  }

  // 🗓 Format ngày (chỉ hiện ngày)
  if (key === "launch_time" && value) {
    try {
      const date = new Date(value);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return value;
    }
  }

  // Hiển thị thương hiệu (có ảnh + tên)
  if (key === "brand" && typeof value === "object") {
    return (
      <div className="flex items-center gap-4">
        {value.image && (
          <img
            src={getImageUrl(value.image)}
            alt={value.name}
            className="w-16 h-16 object-contain border rounded-lg shadow-sm"
          />
        )}
        <span className="font-medium text-gray-800 text-lg">
          {value.name || "-"}
        </span>
      </div>
    );
  }

  // Ảnh sản phẩm chính
  if (key === "primary_image" && typeof value === "object") {
    return (
      <div className="flex justify-center my-4">
        {value.image_path ? (
          <img
            src={getImageUrl(value.image_path)}
            alt="Ảnh sản phẩm chính"
            className="max-h-80 object-contain rounded-xl shadow-md"
          />
        ) : (
          <span>Không có ảnh</span>
        )}
      </div>
    );
  }

  // Nếu là object con (bảng con như screen, memory, utility...)
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <div className="overflow-x-auto">
        <table className="ml-4 border border-gray-200 w-full text-left mb-2 text-sm sm:text-base">
          <tbody>
            {Object.entries(value).map(([k, v]) => {
              if (EXCLUDE_FIELDS.includes(k)) return null;
              return (
                <tr key={k}>
                  <td className="font-semibold pr-2 border-b border-gray-200 w-1/3 text-gray-700 whitespace-nowrap">
                    {FIELD_LABELS[k] || k}
                  </td>
                  <td className="border-b border-gray-200">
                    {renderValue(k, v)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Nếu là mảng
  if (Array.isArray(value)) {
    return (
      <ul className="ml-6 list-disc">
        {value.map((v, i) => (
          <li key={i}>{renderValue(key, v)}</li>
        ))}
      </ul>
    );
  }

  // Trả về giá trị đơn
  return String(value);
};

/** ===============================
 * Main Component
 * =============================== */
const ProductDetailViewModal = ({ item, onClose }) => {
  if (!item) return null;

  const { general_information, ...otherData } = item;

  const sections = Object.entries(otherData).filter(
    ([k, v]) => !EXCLUDE_FIELDS.includes(k) && v !== null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
      <div className="bg-white p-6 rounded-xl w-full max-w-5xl overflow-y-auto max-h-[90vh] relative shadow-2xl">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">
          Chi tiết sản phẩm
        </h2>

        {/* Render các phần còn lại */}
        {sections.map(([key, value]) => {
          if (key === "primary_image") return null;
          return (
            <div
              key={key}
              className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-800 border-b pb-1 border-gray-300">
                {FIELD_LABELS[key] || key}
              </h3>
              {renderValue(key, value)}
            </div>
          );
        })}

        {/* Ảnh sản phẩm chính */}
        {item.primary_image?.image_path && (
          <div className="flex justify-center mb-6">
            <img
              src={getImageUrl(item.primary_image.image_path)}
              alt="Ảnh sản phẩm chính"
              className="max-h-96 object-contain rounded-xl shadow-md"
            />
          </div>
        )}

        {/* Thông tin chung */}
        {general_information && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-2 text-gray-800 border-b pb-1 border-gray-300">
              {FIELD_LABELS.general_information}
            </h3>
            {renderValue("general_information", general_information)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailViewModal;
