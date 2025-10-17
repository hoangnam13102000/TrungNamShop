import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateGeneral } from "../../../utils/validate";
import { registerAPI } from "../../../api/auth/request"; // tạo API riêng

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = {
    username: { required: true, message: "Vui lòng nhập tên đăng nhập" },
    password: { required: true, minLength: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
    confirmPassword: { required: true, match: "password", message: "Mật khẩu xác nhận không khớp" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateGeneral(formData, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await registerAPI({
        username: formData.username,
        password: formData.password,
      });

      if (res?.token) {
        localStorage.setItem("token", res.token);
        alert("Đăng ký thành công!");
        navigate("/dang-nhap");
      } else {
        alert("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      // Nếu Laravel trả về validation lỗi
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const msg = error.response?.data?.message || "Đăng ký thất bại!";
        setErrors({ api: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký</h2>

        {errors.api && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.username ? "border-red-500" : ""}`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.password ? "border-red-500" : ""}`}
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
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${errors.confirmPassword ? "border-red-500" : ""}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm">Hiển thị mật khẩu</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-500 text-white py-2 rounded-xl shadow-md hover:bg-red-600 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Đã có tài khoản? <Link to="/dang-nhap" className="text-red-500 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
