import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../../components/dropdown/DropDown";
import DynamicDialog from "../../components/formAndDialog/DynamicDialog";
import placeholder from "../../assets/admin/logoicon1.jpg";

export default function DynamicForm({
  title,
  fields,
  initialData = {},
  onSave,
  onClose,
  mode = "create", // "create" | "edit" | "view"
}) {
  const safeInitialData = initialData || {};

  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.name] = safeInitialData[f.name] ?? "";
    });
    return initial;
  });

  const [preview, setPreview] = useState(() => {
    const initialPreview = {};
    fields.forEach((f) => {
      if (f.type === "file") {
        initialPreview[f.name] =
          safeInitialData[f.name] instanceof File
            ? URL.createObjectURL(safeInitialData[f.name])
            : safeInitialData[f.name] || placeholder;
      }
    });
    return initialPreview;
  });

  const [localErrors, setLocalErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    mode: "confirm",
    title: "",
    message: "",
    onConfirm: null,
  });

  const showDialog = (mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  };
  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }));

  const handleChange = (name, value) => {
    if (mode === "view") return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    if (mode === "view") return;
    setFormData((prev) => ({ ...prev, [name]: file }));
    setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const validate = () => {
    if (mode === "view") return true;
    const errors = {};
    fields.forEach((f) => {
      if (
        f.required &&
        (formData[f.name] === undefined ||
          formData[f.name] === null ||
          formData[f.name] === "")
      ) {
        errors[f.name] = `${f.label} không được để trống`;
      }
    });
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const performSave = async () => {
    setIsSubmitting(true);
    try {
      const hasFile = fields.some((f) => f.type === "file");
      const dataToSend = hasFile ? new FormData() : {};

      fields.forEach((f) => {
        const value = formData[f.name];
        if (f.type === "file") {
          if (value instanceof File) dataToSend.append(f.name, value);
        } else {
          if (hasFile) dataToSend.append(f.name, value);
          else dataToSend[f.name] = value;
        }
      });

      const mergedData = { ...formData, id: safeInitialData.id };
      await onSave(dataToSend, mergedData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || mode === "view") return;
    if (!validate()) return;

    // ⚠️ Kiểm tra nếu chọn "Ngừng hoạt động" (status = 0)
    if (formData.status === 0 || formData.trangThai === 0) {
      showDialog(
        "confirm",
        "Xác nhận ngừng hoạt động",
        "Bạn có chắc muốn ngừng hoạt động tài khoản này không?",
        async () => {
          closeDialog();
          await performSave();
        }
      );
      return;
    }

    await performSave();
  };

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

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto space-y-4 pr-2"
          >
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === "file" ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div
                      className={`w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 bg-center bg-cover ${
                        mode !== "view" ? "cursor-pointer" : "opacity-80"
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
                        handleFileChange(field.name, e.target.files[0])
                      }
                      className="hidden"
                      disabled={mode === "view"}
                    />
                    <p className="text-xs text-gray-500">
                      {formData[field.name]?.name ||
                        safeInitialData[field.name] ||
                        "Chưa chọn ảnh"}
                    </p>
                  </div>
                ) : field.type === "select" ? (
                  <Dropdown
                    value={formData[field.name]}
                    options={field.options || []}
                    placeholder={`Chọn ${field.label}`}
                    onSelect={(opt) => handleChange(field.name, opt.value)}
                    disabled={mode === "view"}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] ?? ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      mode === "view"
                        ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={field.disabled || mode === "view"}
                  />
                )}

                {localErrors[field.name] && mode !== "view" && (
                  <p className="text-red-500 text-sm mt-1">
                    {localErrors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-2 mt-4">
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
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {isSubmitting
                    ? "Đang lưu..."
                    : mode === "edit"
                    ? "Cập nhật"
                    : "Lưu"}
                </button>
              )}
            </div>
          </form>

          {/* DynamicDialog xác nhận ngừng hoạt động */}
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
