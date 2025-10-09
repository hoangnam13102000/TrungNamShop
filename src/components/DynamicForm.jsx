import { useState, useEffect } from "react";
import placeholder from "../assets/admin/logoicon1.jpg";

export default function DynamicForm({
  title,
  fields,
  initialData,
  onSave,
  onClose,
  readOnly = false,
  mode = "create", // "create" | "edit" | "view"
}) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");

  // Assign initial data (edit or view)
  useEffect(() => {
    setFormData(initialData || {});
    if (initialData?.image && !preview) {
      setPreview(initialData.image);
    }
  }, [initialData]);

  // Update common inputs
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handling upload file
  const handleFileChange = (name, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, [name]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Save
  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return;

    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        alert(`Vui lòng nhập ${field.label}!`);
        return;
      }
    }

    onSave(formData);
  };

  // DynamicTitle
  const renderTitle =
    title ||
    (mode === "edit"
      ? "Cập nhật thông tin"
      : mode === "view"
      ? "Xem chi tiết"
      : "Thêm mới");

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-11/12 sm:w-[420px] p-6 z-[60]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{renderTitle}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>

              {readOnly || mode === "view" ? (
                <div className="border rounded-lg px-3 py-2 bg-gray-50 text-gray-800">
                  {field.type === "file" ? (
                    <img
                      src={formData[field.name] || placeholder}
                      alt=""
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    formData[field.name] || "—"
                  )}
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              ) : field.type === "select" ? (
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                      {opt.label || opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div
                    className="w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 bg-center bg-cover cursor-pointer"
                    style={{
                      backgroundImage: `url(${preview || placeholder})`,
                    }}
                    onClick={() =>
                      document.getElementById(field.name + "-file").click()
                    }
                  />
                  <input
                    id={field.name + "-file"}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(field.name, e.target.files[0])
                    }
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500">
                    Nhấn vào ảnh để tải lên
                  </p>
                </div>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              )}
            </div>
          ))}

          {/* Action Button */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              {readOnly || mode === "view" ? "Đóng" : "Hủy"}
            </button>

            {mode !== "view" && (
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {mode === "edit" ? "Cập nhật" : "Lưu"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
