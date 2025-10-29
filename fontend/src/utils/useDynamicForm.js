import { useState, useEffect, useMemo } from "react";
import { validateGeneral } from "./validate";

export default function useDynamicForm({
  fields = [],
  initialData = {},
  readOnly = false,
  mode = "create",
  onSave = async () => {},
}) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState({});
  const [errors, setErrors] = useState({});
  const [isReadingFile, setIsReadingFile] = useState(false);

  // thêm fallback cho một số field có thể null
  const safeInitialData = useMemo(() => {
    const data = {};
    Object.entries(initialData ?? {}).forEach(([key, value]) => {
      if (value && typeof value === "object" && "id" in value) {
        data[key] = value.id; // chuyển object -> id
      } else {
        data[key] = value ?? "";
      }
    });
    return data;
  }, [initialData]);

  const computedFields = useMemo(
    () =>
      fields.map((f) =>
        f.name === "username" && mode === "edit" ? { ...f, disabled: true } : f
      ),
    [fields, mode]
  );

  useEffect(() => {
    const data = {};
    const initialPreview = {};
    computedFields.forEach((f) => {
      data[f.name] = safeInitialData[f.name] ?? "";
      if (f.type === "file") {
        let img = safeInitialData[f.name] || safeInitialData.image_path || "";
        initialPreview[f.name] = img;
      }
    });
    setFormData(data);
    setPreview(initialPreview);
  }, [safeInitialData, computedFields]);

  const handleChange = (name, value, type = "string") => {
    if (type === "number") value = Number(value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (name, file) => {
    if (!file) return;
    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview((prev) => ({ ...prev, [name]: reader.result }));
      setIsReadingFile(false);
    };
    reader.onerror = () => setIsReadingFile(false);
    reader.readAsDataURL(file);
    setFormData((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const rules = {};
    computedFields.forEach((f) => {
      rules[f.name] = {
        required: f.required,
        type: f.validationType,
        minLength: f.minLength,
        match: f.match,
        message: f.message,
      };
    });
    const validationErrors = validateGeneral(formData, rules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (readOnly || mode === "view") return;
    if (!validateForm()) return;

    while (isReadingFile) await new Promise((r) => setTimeout(r, 50));

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === "object" && "id" in value) {
          formDataToSend.append(key, value.id);
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      await onSave(formDataToSend);
      return true;
    } catch (error) {
      console.error("Save error:", error);
      return false;
    }
  };

  return {
    formData,
    preview,
    errors,
    computedFields,
    handleChange,
    handleFileChange,
    handleSubmit,
    isReadingFile,
  };
}
