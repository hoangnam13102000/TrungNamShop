import { useState } from "react";
import placeholder from "../../../../../assets/admin/logoicon1.jpg"; // ảnh default
import { validateGeneral } from "../../../../../utils/validate";
import { brandRules } from "../../../../../utils/formRules";
import BackButton from "../../../../../components/common/BackButton";

export default function AddBrand({ onAddBrand, onBack }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({ name: "", file: "" });

 
  const validateField = (fieldName, value) => {
    const fieldData = { [fieldName]: value };
    const fieldRule = { [fieldName]: brandRules[fieldName] };
    const fieldErrors = validateGeneral(fieldData, fieldRule);
    setErrors((prev) => ({ ...prev, [fieldName]: fieldErrors[fieldName] || "" }));
  };


  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    validateField("file", selectedFile);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = { name, file };
    const validationErrors = validateGeneral(formData, brandRules);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newBrand = {
      id: Date.now(),
      name: name.trim(),
      image: preview,
    };

    onAddBrand(newBrand);

    // Reset form
    setName("");
    setFile(null);
    setPreview(null);
    setErrors({ name: "", file: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Back Button */}
      <BackButton onClick={onBack} />
      
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center w-full">
        Thêm thương hiệu
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md flex flex-col gap-4"
      >
        {/* Brand Name */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Tên thương hiệu</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateField("name", e.target.value);
            }}
            placeholder="Nhập tên thương hiệu"
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Choose Image */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Tải hình ảnh</label>
          <label className="cursor-pointer w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden hover:border-red-500 transition-colors">
            <img
              src={preview || placeholder}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Thêm thương hiệu
        </button>
      </form>
    </div>
  );
}
