import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../../components/dropdown/DropDown";
import DynamicDialog from "./DynamicDialog";
import placeholder from "../../assets/admin/logoicon1.jpg";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import { validateGeneral } from "../../utils/forms/validate";

export default function DynamicForm({
  title,
  fields,
  initialData = {},
  onSave,
  onClose,
  mode = "create", // chỉ còn create | edit
}) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

  /** ==========================
   * 1. INIT / UPDATE WHEN DATA CHANGES
   * ========================== */
  useEffect(() => {
    const updatedData = {};
    const updatedPreview = {};

    fields.forEach((f) => {
      updatedData[f.name] = initialData?.[f.name] ?? "";

      // ✅ FIX hiển thị giá trị cho field disable
      if (!updatedData[f.name] && f.disabled) {
        const baseKey = f.name.replace("_id", "").replace("_name", "");
        const possibleObj = initialData?.[baseKey];
        if (possibleObj && typeof possibleObj === "object") {
          updatedData[f.name] =
            possibleObj.account_type_name ||
            possibleObj.name ||
            possibleObj.label ||
            "";
        }
      }

      if (f.type === "file" || f.type === "custom-image") {
        let imageValue = initialData?.[f.name] || initialData?.image_path || "";
        if (imageValue && typeof imageValue === "string") {
          imageValue = getImageUrl(imageValue);
        }
        updatedPreview[f.name] = imageValue || placeholder;
      }
    });

    setFormData(updatedData);
    setPreview(updatedPreview);
  }, [initialData, fields]);

  /** ==========================
   * 2. HANDLERS
   * ========================== */
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (name, file) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
    setPreview((prev) => ({
      ...prev,
      [name]: file ? URL.createObjectURL(file) : placeholder,
    }));
  };

  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  /** ==========================
   * 3. VALIDATION
   * ========================== */
  const validate = () => {
    const rules = {};
    fields.forEach((f) => {
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

  /** ==========================
   * 4. SUBMIT
   * ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setSubmitting(false);
    }
  };

  /** ==========================
   * 5. UI
   * ========================== */
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
            {title}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto space-y-5 pr-2"
          >
            {fields.map((field) => {
              const value = formData?.[field.name] ?? "";
              const error = errors?.[field.name];

              // ==== CUSTOM IMAGE ====
              if (field.type === "custom-image") {
                return (
                  <div key={field.name} className="flex flex-col items-center gap-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      {field.label}
                    </label>
                    <img
                      src={preview[field.name] || placeholder}
                      alt={field.label}
                      className="w-40 h-40 object-cover rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                      onError={(e) => (e.target.src = placeholder)}
                    />
                  </div>
                );
              }

              // ==== FILE UPLOAD ====
              if (field.type === "file") {
                return (
                  <div key={field.name} className="flex flex-col items-center gap-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      {field.label}{" "}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div
                      className={`w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-center bg-cover transition-all cursor-pointer hover:border-blue-400`}
                      style={{
                        backgroundImage: `url(${preview?.[field.name] || placeholder})`,
                      }}
                      onClick={() =>
                        document.getElementById(field.name + "-file")?.click()
                      }
                    />
                    <input
                      id={field.name + "-file"}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(field.name, e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 truncate max-w-[90%] text-center">
                      {formData?.[field.name]?.name ||
                        initialData?.[field.name] ||
                        "Chưa chọn ảnh"}
                    </p>
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                  </div>
                );
              }

              // ==== SELECT ====
              if (field.type === "select") {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}{" "}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <Dropdown
                      value={value}
                      options={field.options}
                      placeholder={`Chọn ${field.label}`}
                      onSelect={(opt) => handleChange(field.name, opt.value)}
                      disabled={field.disabled}
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                  </div>
                );
              }

              // ==== CHECKBOX ====
              if (field.type === "checkbox") {
                return (
                  <div
                    key={field.name}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      disabled={field.disabled}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                    />
                    <label className="text-gray-700 font-medium cursor-pointer">
                      {field.label}
                    </label>
                  </div>
                );
              }

              // ==== DEFAULT INPUT ====
              return (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={`Nhập ${field.label.toLowerCase()}`}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 transition-all focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                    disabled={field.disabled}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>
              );
            })}

            {/* ==== BUTTONS ==== */}
            <div className="flex justify-end gap-3 pt-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all font-medium text-gray-700"
              >
                Đóng
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                }`}
              >
                {submitting
                  ? "Đang lưu..."
                  : mode === "edit"
                  ? "Cập nhật"
                  : "Lưu"}
              </button>
            </div>
          </form>

          {/* ==== DIALOG ==== */}
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