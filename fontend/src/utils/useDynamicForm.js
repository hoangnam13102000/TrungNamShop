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
  const [localErrors, setLocalErrors] = useState({});
  const [isReadingFile, setIsReadingFile] = useState(false);

  // --- CHECK DUPLICATE & LOCK FIELD ---
  const computedFields = useMemo(() => {
    const names = fields.map((f) => f.name);
    const duplicates = names.filter(
      (n, i) => names.indexOf(n) !== i && n !== undefined
    );
    if (duplicates.length > 0) {
      console.warn("[useDynamicForm] Duplicate field names detected:", duplicates);
    }

    return fields.map((f) =>
      f.name === "username" && mode === "edit"
        ? { ...f, disabled: true }
        : f
    );
  }, [fields, mode]);

  // --- INIT DATA ---
  useEffect(() => {
    if (!initialData || Object.keys(initialData).length === 0) return;

    setFormData((prev) => {
      const isSame = JSON.stringify(prev) === JSON.stringify(initialData);
      return isSame ? prev : initialData;
    });

    const initialPreview = {};
    computedFields.forEach((field) => {
      if (field.type === "file" && initialData[field.name]) {
        initialPreview[field.name] = initialData[field.name];
      }
    });
    setPreview(initialPreview);
  }, [initialData, computedFields]);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // --- HANDLE FILE CHANGE ---
  const handleFileChange = (name, file) => {
    if (!file) return;
    setIsReadingFile(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview((prev) => ({ ...prev, [name]: reader.result }));
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      console.error("Error reading file:", file.name);
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({ ...prev, [name]: file }));
    setLocalErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // --- VALIDATE ---
  const validateForm = () => {
    const rules = {};
    computedFields.forEach((field) => {
      rules[field.name] = {
        required: field.required,
        type: field.validateType,
        minLength: field.minLength,
        match: field.match,
        message: field.message,
      };
    });

    const validationErrors = validateGeneral(formData, rules);
    setLocalErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (readOnly || mode === "view") return;
    if (!validateForm()) return;

    // const confirmed = window.confirm("Bạn có chắc chắn muốn lưu dữ liệu này không?");
    // if (!confirmed) return;

    while (isReadingFile) {
      await new Promise((r) => setTimeout(r, 50));
    }

    const hasFile = computedFields.some((f) => f.type === "file");
    try {
      if (hasFile) {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formDataToSend.append(key, value);
          }
        });
        await onSave(formDataToSend);
      } else {
        await onSave(formData);
      }

      console.log("Form đã được lưu thành công!");
      return true; 
    } catch (error) {
      console.error("Error during form submit:", error);
      return false; 
    }
  };

  return {
    formData,
    preview,
    localErrors,
    computedFields,
    handleChange,
    handleFileChange,
    handleSubmit,
    isReadingFile,
  };
}
