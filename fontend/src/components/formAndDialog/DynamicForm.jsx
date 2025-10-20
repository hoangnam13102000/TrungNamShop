import Dropdown from "../dropdown/DropDown";
import placeholder from "../../assets/admin/logoicon1.jpg";
import useDynamicForm from "../../utils/useDynamicForm";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  const {
    formData,
    preview,
    localErrors,
    computedFields,
    handleChange,
    handleFileChange,
    handleSubmit,
    isReadingFile,
  } = useDynamicForm({ fields, initialData, readOnly, mode, onSave });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderTitle =
    title ||
    (mode === "edit"
      ? "Update"
      : mode === "view"
      ? "View Details"
      : "Create New");

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const success = await handleSubmit(e);
    if (success) {
      onClose(); 
    }

    setTimeout(() => setIsSubmitting(false), 500);
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
          <h2 className="text-xl font-semibold mb-4">{renderTitle}</h2>

          <div className="flex-1 overflow-y-auto pr-2">
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {computedFields.map((field, index) => (
                <div key={`${field.name}-${index}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
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
                    <>
                      <textarea
                        value={formData[field.name] || ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className={`w-full border rounded-lg px-3 py-2 ${
                          field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        disabled={field.disabled}
                      />
                      {(errors[field.name] || localErrors[field.name]) && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field.name] || localErrors[field.name]}
                        </p>
                      )}
                    </>
                  ) : field.type === "select" ? (
                    <Dropdown
                      value={formData[field.name] || ""}
                      options={field.options || []}
                      label={field.label}
                      onSelect={(option) =>
                        handleChange(field.name, option.value)
                      }
                    />
                  ) : field.type === "file" ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div
                        className={`w-40 h-40 border border-gray-300 rounded-lg bg-gray-100 bg-center bg-cover relative ${
                          isReadingFile
                            ? "opacity-70 cursor-wait"
                            : "cursor-pointer"
                        }`}
                        style={{
                          backgroundImage: `url(${
                            preview[field.name] || placeholder
                          })`,
                        }}
                        onClick={() =>
                          !isReadingFile &&
                          document.getElementById(field.name + "-file").click()
                        }
                      >
                        {isReadingFile && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-gray-600 text-sm rounded-lg">
                            Loading...
                          </div>
                        )}
                      </div>
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
                        {formData[field.name]?.name || "Chưa chọn ảnh"}
                      </p>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        field.disabled ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      disabled={field.disabled}
                    />
                  )}

                  {(errors[field.name] || localErrors[field.name]) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name] || localErrors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </form>
          </div>

          <div className="flex justify-end gap-2 pt-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              {readOnly || mode === "view" ? "Close" : "Cancel"}
            </button>

            {mode !== "view" && (
              <button
                type="submit"
                onClick={handleFinalSubmit}
                disabled={isReadingFile || isSubmitting}
                className={`px-4 py-2 rounded-lg text-white ${
                  isReadingFile || isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isReadingFile
                  ? "Loading..."
                  : isSubmitting
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update"
                  : "Save"}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
