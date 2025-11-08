import React, { useState } from "react";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

const EXCLUDE_FIELDS = [
  "id",
  "images",
  "created_at",
  "updated_at",
  "deleted_at",
  "product_image",
  "product_name",
  "price_label",
];

const FIELD_LABELS = {
  product: "Thông tin sản phẩm",
  name: "Tên sản phẩm",
  description: "Mô tả",
  status: "Trạng thái",
  price: "Giá bán",
  stock_quantity: "Tồn kho",
  color: "Màu sắc",
  brand: "Thương hiệu",
  primary_image: "Ảnh sản phẩm chính",
  general_information: "Thông tin chung",
  design: "Thiết kế",
  material: "Chất liệu",
  dimensions: "Kích thước",
  weight: "Khối lượng",
  launch_time: "Ngày ra mắt",
  screen: "Màn hình",
  display_technology: "Công nghệ hiển thị",
  resolution: "Độ phân giải",
  screen_size: "Kích thước màn hình",
  max_brightness: "Độ sáng tối đa",
  glass_protection: "Kính bảo vệ",
  rear_camera: "Camera sau",
  front_camera: "Camera trước",
  aperture: "Khẩu độ",
  video_capability: "Quay video",
  features: "Tính năng",
  memory: "Bộ nhớ",
  ram: "RAM",
  internal_storage: "Bộ nhớ trong",
  memory_card_slot: "Khe thẻ nhớ",
  operating_system: "Hệ điều hành",
  processor: "Bộ xử lý",
  cpu_speed: "Tốc độ CPU",
  gpu: "GPU",
  battery_charging: "Pin & Sạc",
  battery_capacity: "Dung lượng pin",
  charging_port: "Cổng sạc",
  charging: "Công nghệ sạc",
  utility: "Tiện ích",
  advanced_security: "Bảo mật nâng cao",
  special_features: "Tính năng đặc biệt",
  water_dust_resistance: "Chống nước / bụi",
  communication_connectivity: "Kết nối & Giao tiếp",
  nfc: "NFC",
  sim_slot: "Khe SIM",
  mobile_network: "Mạng di động",
  gps: "Định vị GPS",
};

const CATEGORY_ICONS = {
  screen: "📱",
  rear_camera: "📷",
  front_camera: "🤳",
  memory: "💾",
  operating_system: "⚙️",
  battery_charging: "🔋",
  communication_connectivity: "📡",
  general_information: "ℹ️",
  utility: "✨",
};

const renderValue = (key, value) => {
  if (value === null || value === undefined) return "-";

  if (key === "status") {
    return value ? (
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
        <FaCheckCircle className="text-sm" />
        Đang bán
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
        <FaTimesCircle className="text-sm" />
        Ngừng bán
      </span>
    );
  }

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

  if (key === "brand" && typeof value === "object") {
    return (
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100/50 shadow-sm">
        {value.image && (
          <img
            src={getImageUrl(value.image)}
            alt={value.name}
            className="w-24 h-24 object-contain bg-white p-3 rounded-xl shadow-md border border-gray-200"
          />
        )}
        <div>
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Thương hiệu</p>
          <p className="font-bold text-lg text-gray-900 mt-1">{value.name || "-"}</p>
        </div>
      </div>
    );
  }

  if (key === "primary_image" && typeof value === "object") {
    return (
      <div className="flex justify-center my-8">
        {value.image_path ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 blur-2xl opacity-50 rounded-3xl"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <img
                src={getImageUrl(value.image_path)}
                alt="Ảnh sản phẩm chính"
                className="max-h-96 object-contain"
              />
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Không có ảnh</span>
        )}
      </div>
    );
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {Object.entries(value).map(([k, v]) => {
          if (EXCLUDE_FIELDS.includes(k)) return null;
          return (
            <div
              key={k}
              className="flex gap-4 py-3 px-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30 transition-all duration-200"
            >
              <span className="font-semibold text-gray-700 min-w-40 text-sm sm:text-base">
                {FIELD_LABELS[k] || k}
              </span>
              <span className="text-gray-600 flex-1 text-sm sm:text-base">
                {renderValue(k, v)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200">
            <span className="text-blue-500 font-bold text-lg leading-tight">•</span>
            <span className="text-gray-700 text-sm sm:text-base pt-0.5">
              {renderValue(key, v)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return String(value);
};

const ProductDetailViewModal = ({ item, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});

  if (!item) return null;

  const { general_information, ...otherData } = item;

  const sections = Object.entries(otherData).filter(
    ([k, v]) => !EXCLUDE_FIELDS.includes(k) && v !== null
  );

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 sm:px-8 py-6 sm:py-8 flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
              Chi tiết
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Thông số sản phẩm 1
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200 flex-shrink-0"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 sm:p-8 space-y-5">
            {/* Ảnh sản phẩm chính */}
            {item.primary_image?.image_path && (
              <div className="mb-10">
                {renderValue("primary_image", item.primary_image)}
              </div>
            )}

            {/* Các phần thông tin */}
            {sections.map(([key, value]) => {
              if (key === "primary_image") return null;
              const isExpanded = expandedSections[key] !== false;

              return (
                <div key={key} className="group">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity group"
                  >
                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                    <span className="text-2xl">{CATEGORY_ICONS[key] || "📋"}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 text-left">
                      {FIELD_LABELS[key] || key}
                    </h3>
                    <span className={`text-gray-400 text-xl transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-50 p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200/50 transition-all duration-200 ml-0">
                      <div className="animate-fadeIn">
                        {renderValue(key, value)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thông tin chung */}
            {general_information && (
              <div className="group">
                <button
                  onClick={() => toggleSection("general")}
                  className="w-full flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
                >
                  <div className="w-1.5 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
                  <span className="text-2xl">ℹ️</span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 text-left">
                    {FIELD_LABELS.general_information}
                  </h3>
                  <span className={`text-gray-400 text-xl transition-transform duration-300 ${expandedSections["general"] !== false ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {expandedSections["general"] !== false && (
                  <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 p-6 sm:p-7 rounded-2xl border border-green-200/30 shadow-sm hover:shadow-lg transition-all duration-200 ml-0">
                    <div className="animate-fadeIn">
                      {renderValue("general_information", general_information)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 via-gray-50 to-gray-100 px-6 sm:px-8 py-5 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all font-semibold text-sm sm:text-base"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              Object.keys(expandedSections).forEach(key => {
                setExpandedSections(prev => ({ ...prev, [key]: true }));
              });
              setExpandedSections({ ...expandedSections, general: true });
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-sm sm:text-base"
          >
            Mở tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailViewModal;