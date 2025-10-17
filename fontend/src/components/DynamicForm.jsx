import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import placeholder from "../assets/admin/logoicon1.jpg";

export default function DynamicForm({
  title,
  fields,
  initialData,
  onSave,
  onClose,
  readOnly = false,
  mode = "create",
  errors = {},
}) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState({});
  const [localErrors, setLocalErrors] = useState({});

  // Initialize form data and image preview
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const initialPreview = {};
      fields.forEach((field) => {
        if (field.type === "file" && initialData[field.name]) {
          initialPreview[field.name] = initialData[field.name];
        }
      });
      setPreview(initialPreview);
    }
  }, [initialData, fields]);

  // Handle input value changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle file (image) uploads
  const handleFileChange = (name, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview((prev) => ({ ...prev, [name]: reader.result }));
      setFormData((prev) => ({ ...prev, [name]: reader.result }));
      setLocalErrors((prev) => ({ ...prev, [name]: "" }));
    };
    reader.readAsDataURL(file);
  };

  // Validate form before saving
  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} là bắt buộc`;
      }
    });
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly || mode === "view") return;
    if (!validateForm()) return;
    onSave(formData);
  };

  const renderTitle =
    title ||
    (mode === "edit"
      ? "Cập nhật"
      : mode === "view"
      ? "Xem chi tiết"
      : "Tạo mới");

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-11/12 sm:w-[600px] max-h-[90vh] flex flex-col p-6 z-[60]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 flex-shrink-0">
          {renderTitle}
        </h2>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {/* Read-only or view mode */}
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
                  <>
                    <textarea
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    {(errors[field.name] || localErrors[field.name]) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name] || localErrors[field.name]}
                      </p>
                    )}
                  </>
                ) : field.type === "select" ? (
                  <>
                    <Dropdown
                      label={
                        formData[field.name]
                          ? field.options.find(
                              (opt) => opt.value === formData[field.name]
                            )?.label
                          : field.label
                      }
                      options={field.options || []}
                      onSelect={(option) =>
                        handleChange(field.name, option.value)
                      }
                    />
                    {(errors[field.name] || localErrors[field.name]) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name] || localErrors[field.name]}
                      </p>
                    )}
                  </>
                ) : field.type === "file" ? (
                  <>
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div
                        className="w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 bg-center bg-cover cursor-pointer"
                        style={{
                          backgroundImage: `url(${
                            preview[field.name] || placeholder
                          })`,
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
                    {(errors[field.name] || localErrors[field.name]) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name] || localErrors[field.name]}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    {(errors[field.name] || localErrors[field.name]) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name] || localErrors[field.name]}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </form>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-2 pt-2 flex-shrink-0 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            {readOnly || mode === "view" ? "Đóng" : "Huỷ"}
          </button>

          {mode !== "view" && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {mode === "edit" ? "Cập nhật" : "Lưu"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
