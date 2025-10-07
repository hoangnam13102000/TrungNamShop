// src/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { validateGeneral } from "../../../utils/validate"; // import validate chung

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // rules validate
  const rules = {
    username: { required: true, message: "Vui lòng nhập tên đăng nhập" },
    fullname: { required: true, message: "Vui lòng nhập họ tên" },
    email: { required: true, email: true, message: "Email không hợp lệ" },
    password: { required: true, minLength: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
    confirmPassword: {
      required: true,
      match: "password",
      message: "Mật khẩu xác nhận không khớp",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateGeneral(formData, rules);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Register form submitted:", formData);
      // Xử lý đăng ký
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <input
              type="text"
              name="fullname"
              placeholder="Nhập họ tên"
              value={formData.fullname}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.fullname ? "border-red-500" : ""
              }`}
            />
            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm">
              Hiển thị mật khẩu
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            ĐĂNG KÝ
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="text-red-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
