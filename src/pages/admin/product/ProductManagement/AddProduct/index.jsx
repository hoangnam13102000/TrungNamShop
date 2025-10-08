import { useState } from "react";
import placeholder from "../../../../../assets/admin/logoicon1.jpg";
import BackButton from "../../../../../components/common/BackButton";
import { validateGeneral } from "../../../../../utils/validate";
import { productRules } from "../../../../../utils/formRules";

export default function AddProduct({ onAddProduct, onBack }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    const fieldData = { [fieldName]: value };
    const fieldRule = { [fieldName]: productRules[fieldName] };
    const fieldErrors = validateGeneral(fieldData, fieldRule);
    setErrors((prev) => ({ ...prev, [fieldName]: fieldErrors[fieldName] || "" }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    validateField("file", selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { name, price, brand, file };
    const validationErrors = validateGeneral(formData, productRules);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: name.trim(),
      price: parseFloat(price),
      brand,
      description: desc.trim(),
      image: preview,
    };

    onAddProduct(newProduct);

    // reset form
    setName("");
    setPrice("");
    setBrand("");
    setDesc("");
    setFile(null);
    setPreview(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
        Thêm sản phẩm
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md flex flex-col gap-4"
      >
        {/* Tên sản phẩm */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Tên sản phẩm</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateField("name", e.target.value);
            }}
            placeholder="Nhập tên sản phẩm"
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Giá */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Giá (VNĐ)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              validateField("price", e.target.value);
            }}
            placeholder="Nhập giá sản phẩm"
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.price ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"
            }`}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Thương hiệu */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Thương hiệu</label>
          <select
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              validateField("brand", e.target.value);
            }}
            className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              errors.brand ? "border-red-500 focus:ring-red-500" : "focus:ring-red-500"
            }`}
          >
            <option value="">-- Chọn thương hiệu --</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Oppo">Oppo</option>
          </select>
          {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
        </div>

        {/* Mô tả */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Mô tả</label>
          <textarea
            rows="3"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Nhập mô tả sản phẩm (tuỳ chọn)"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Ảnh sản phẩm */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Hình ảnh sản phẩm</label>
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
          {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}
