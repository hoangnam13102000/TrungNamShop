import  { useState, useEffect } from "react";
import placeholder from "../assets/admin/logoicon1.jpg";

export default function DynamicForm({ title, fields, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");

  //  Assign initial data
  useEffect(() => {
    setFormData(initialData || {});
    if (initialData?.image && !preview) {
      setPreview(initialData.image);
    }
  }, [initialData]);

  // Update input text, select, textarea
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File upload processing
  const handleFileChange = (name, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData((prev) => ({ ...prev, [name]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  //  Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        alert(`Vui lòng nhập ${field.label}!`);
        return;
      }
    }
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // Click ra ngoài để đóng form
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-11/12 sm:w-[420px] p-6 z-[60]"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn overlay bắt sự kiện
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>

              {field.type === "textarea" ? (
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
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  {/* Preview image can be clicked to upload */}
                  <div
                    className="w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 bg-center bg-cover cursor-pointer"
                    style={{
                      backgroundImage: `url(${preview || placeholder})`,
                    }}
                    onClick={() => document.getElementById(field.name + "-file").click()}
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
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
