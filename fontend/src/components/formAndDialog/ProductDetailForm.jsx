import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../dropdown/DropDown";
import DynamicDialog from "./DynamicDialog";
import placeholder from "../../assets/admin/logoicon1.jpg";
import { getImageUrl } from "../../utils/getImageUrl";
import { validateGeneral } from "../../utils/validate";

export default function DynamicForm({
  title,
  fields = [], // nếu dùng fieldGroups thì fields có thể rỗng
  fieldGroups = [], // ✅ thêm prop hỗ trợ nhóm section
  initialData = {},
  onSave = () => {},
  onClose = () => {},
  mode = "create", // create | edit | view
}) {
  /** ============================================================
   *                 0. GHÉP FIELDS (an toàn)
   * ============================================================ */
  let allFields = [];
  if (Array.isArray(fieldGroups) && fieldGroups.length > 0) {
    allFields = fieldGroups.flatMap((g) => g.fields || []);
  } else if (Array.isArray(fields)) {
    allFields = fields;
  } else {
    console.warn("⚠️ DynamicForm: không có field hợp lệ nào được truyền vào!");
  }

  const safeData = initialData || {};

  /** ============================================================
   *                           1. STATE
   * ============================================================ */
  const [formData, setFormData] = useState(() => {
    const result = {};
    allFields.forEach((f) => {
      result[f.name] = safeData[f.name] ?? "";
    });
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

  /** ============================================================
   *                           2. HANDLE INPUT
   * ============================================================ */
  const handleChange = (name, value) => {
    if (mode === "view") return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    if (mode === "view") return;
    setFormData((prev) => ({ ...prev, [name]: file }));
    setPreview((prev) => ({
      ...prev,
      [name]: file ? URL.createObjectURL(file) : placeholder,
    }));
  };

  /** ============================================================
   *                       3. VALIDATION
   * ============================================================ */
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

  /** ============================================================
   *                         4. SUBMIT FORM
   * ============================================================ */
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

  /** ============================================================
   *                               5. RENDER
   * ============================================================ */
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-xl shadow-xl w-11/12 sm:w-[600px] max-h-[90vh] flex flex-col p-6 z-[60]"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {mode === "view" ? "Chi tiết" : title}
          </h2>

          {allFields.length === 0 ? (
            <p className="text-gray-500 text-center">
              Không có trường nào để hiển thị.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto space-y-6 pr-2"
            >
              {fieldGroups.length > 0
                ? fieldGroups.map((group, gi) => (
                    <div key={gi} className="border-t pt-3 first:border-none first:pt-0">
                      {group.section && (
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {group.section}
                        </h3>
                      )}
                      <div className="space-y-4">
                        {group.fields.map((field) => {
                          const value = formData[field.name] ?? "";
                          const error = errors[field.name];

                          return (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}{" "}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label>

                              {field.type === "file" ? (
                                <div className="flex flex-col items-center gap-2 w-full">
                                  <div
                                    className={`w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 bg-center bg-cover ${
                                      mode !== "view"
                                        ? "cursor-pointer"
                                        : "opacity-80"
                                    }`}
                                    style={{
                                      backgroundImage: `url(${
                                        preview[field.name] || placeholder
                                      })`,
                                    }}
                                    onClick={() => {
                                      if (mode !== "view")
                                        document
                                          .getElementById(field.name + "-file")
                                          .click();
                                    }}
                                  />
                                  <input
                                    id={field.name + "-file"}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFileChange(
                                        field.name,
                                        e.target.files[0]
                                      )
                                    }
                                    className="hidden"
                                    disabled={mode === "view"}
                                  />
                                  <p className="text-xs text-gray-500 truncate max-w-[90%] text-center">
                                    {formData[field.name]?.name ||
                                      safeData[field.name] ||
                                      safeData.image_path ||
                                      "Chưa chọn ảnh"}
                                  </p>
                                </div>
                              ) : field.type === "select" ? (
                                <Dropdown
                                  value={value}
                                  options={field.options || []}
                                  placeholder={`Chọn ${field.label}`}
                                  onSelect={(opt) =>
                                    handleChange(field.name, opt.value)
                                  }
                                  disabled={mode === "view"}
                                />
                              ) : field.type === "checkbox" ? (
                                <input
                                  type="checkbox"
                                  checked={!!value}
                                  onChange={(e) =>
                                    handleChange(
                                      field.name,
                                      e.target.checked
                                    )
                                  }
                                  disabled={field.disabled || mode === "view"}
                                />
                              ) : (
                                <input
                                  type={field.type || "text"}
                                  value={value}
                                  onChange={(e) =>
                                    handleChange(field.name, e.target.value)
                                  }
                                  className={`w-full border rounded-lg px-3 py-2 ${
                                    mode === "view"
                                      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                                      : ""
                                  }`}
                                  disabled={field.disabled || mode === "view"}
                                />
                              )}

                              {error && mode !== "view" && (
                                <p className="text-red-500 text-sm mt-1">
                                  {error}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                : allFields.map((field) => (
                    <div key={field.name}>{/* fallback đơn giản */}</div>
                  ))}

              {/* BUTTONS */}
              <div className="flex justify-end gap-2 pt-4 mt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Đóng
                </button>

                {mode !== "view" && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-4 py-2 rounded-lg text-white ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {submitting
                      ? "Đang lưu..."
                      : mode === "edit"
                      ? "Cập nhật"
                      : "Lưu"}
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
