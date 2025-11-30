import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../UI/dropdown/DropDown";
import DynamicDialog from "./DynamicDialog";
import placeholder from "../../assets/admin/logoicon1.jpg";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import { validateGeneral } from "../../utils/forms/validate";

export default function DynamicForm({
  title,
  fields = [],
  fieldGroups = [],
  initialData = {},
  onSave = () => {},
  onClose = () => {},
  mode = "create", // create | edit | view
}) {
  const allFields = Array.isArray(fieldGroups) && fieldGroups.length > 0
    ? fieldGroups.flatMap((g) => g.fields || [])
    : Array.isArray(fields)
    ? fields
    : [];

  const safeData = initialData || {};

  const [formData, setFormData] = useState(() => {
    const result = {};
    allFields.forEach((f) => {
      result[f.name] = safeData[f.name] ?? "";
    });
    // đảm bảo final_price luôn có giá trị
    if ("price" in result && !("final_price" in result)) {
      result.final_price = parseFloat(result.price) || 0;
    }
    return result;
  });

  const [preview, setPreview] = useState(() => {
    const result = {};
    allFields.forEach((f) => {
      if (f.type === "file") {
        let imageValue = safeData[f.name] || safeData.image_path || "";
        if (imageValue && typeof imageValue === "string") {
          imageValue = getImageUrl(imageValue);
        }
        result[f.name] = imageValue || placeholder;
      }
    });
    return result;
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

  const openDialog = (mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  };
  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  // --- HANDLE CHANGE ---
  const handleChange = (name, value) => {
    if (mode === "view") return;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Cập nhật final_price nếu price hoặc promotion_id thay đổi
      if ("price" in newData || "promotion_id" in newData) {
        const price = parseFloat(newData.price) || 0;
        let discount = 0;

        if (newData.promotion_id) {
          const promoField = allFields.find((f) => f.name === "promotion_id");
          const selectedPromo = promoField?.options?.find(
            (opt) => opt.value === newData.promotion_id
          );
          discount = selectedPromo?.discount_percent || 0;
        }

        newData.final_price = price - (price * discount) / 100;
      }

      return newData;
    });
  };

  const handleFileChange = (name, file) => {
    if (mode === "view") return;
    setFormData((prev) => ({ ...prev, [name]: file }));
    setPreview((prev) => ({
      ...prev,
      [name]: file ? URL.createObjectURL(file) : placeholder,
    }));
  };

  // --- VALIDATION ---
  const validate = () => {
    if (mode === "view") return true;
    const rules = {};
    allFields.forEach((f) => {
      rules[f.name] = {
        required: f.required,
        type: f.validationType,
        minLength: f.minLength,
        match: f.match,
        message: f.message,
      };
    });
    const newErrors = validateGeneral(formData, rules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || mode === "view") return;
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onSave(formData);
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER ---
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[600px] max-h-[90vh] flex flex-col p-8 z-[60]"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            {mode === "view" ? "Chi tiết" : title}
          </h2>

          {allFields.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Không có trường nào để hiển thị.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto space-y-6 pr-3"
            >
              {fieldGroups.map((group, gi) => (
                <div key={gi} className="border-t border-gray-200 pt-6 first:border-none first:pt-0">
                  {group.section && (
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                      {group.section}
                    </h3>
                  )}
                  <div className="space-y-5">
                    {group.fields.map((field) => {
                      const value = formData[field.name] ?? "";
                      const error = errors[field.name];

                      return (
                        <div key={field.name}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>

                          {field.type === "file" ? (
                            <div className="flex flex-col items-center gap-3 w-full">
                              <div
                                className={`w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 bg-center bg-cover transition-all ${
                                  mode !== "view"
                                    ? "cursor-pointer hover:border-blue-400 hover:from-blue-50 hover:to-indigo-50"
                                    : "opacity-75"
                                }`}
                                style={{ backgroundImage: `url(${preview[field.name] || placeholder})` }}
                                onClick={() => {
                                  if (mode !== "view")
                                    document.getElementById(field.name + "-file").click();
                                }}
                              />
                              <input
                                id={field.name + "-file"}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                                className="hidden"
                                disabled={mode === "view"}
                              />
                              <p className="text-xs text-gray-500 truncate max-w-[90%] text-center">
                                {formData[field.name]?.name || safeData[field.name] || safeData.image_path || "JPG, PNG, GIF (max 5MB)"}
                              </p>
                            </div>
                          ) : field.type === "select" ? (
                            <Dropdown
                              value={value}
                              options={field.options || []}
                              placeholder={`Chọn ${field.label}`}
                              onSelect={(opt) => handleChange(field.name, opt.value)}
                              disabled={mode === "view"}
                              renderOption={(opt) =>
                                field.name === "promotion_id" ? `${opt.label} - ${opt.discount_percent || 0}%` : opt.label
                              }
                            />
                          ) : field.type === "checkbox" ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={!!value}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                                disabled={field.disabled || mode === "view"}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                              />
                              <label className="text-gray-700 font-medium cursor-pointer">{field.label}</label>
                            </div>
                          ) : (
                            <input
                              type={field.type || "text"}
                              value={value}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              placeholder={`Nhập ${field.label.toLowerCase()}`}
                              className={`w-full border border-gray-200 rounded-lg px-4 py-3 transition-all focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                                mode === "view" ? "bg-gray-50 text-gray-600 cursor-not-allowed" : "bg-white"
                              }`}
                              disabled={field.disabled || mode === "view" || field.name === "final_price"}
                            />
                          )}
                          {error && mode !== "view" && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-medium text-gray-700"
                >
                  Đóng
                </button>
                {mode !== "view" && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                    }`}
                  >
                    {submitting ? "Đang lưu..." : mode === "edit" ? "Cập nhật" : "Lưu"}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* CONFIRM DIALOG */}
          <DynamicDialog
            open={dialog.open}
            mode={dialog.mode}
            title={dialog.title}
            message={dialog.message}
            onClose={closeDialog}
            onConfirm={dialog.onConfirm}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
