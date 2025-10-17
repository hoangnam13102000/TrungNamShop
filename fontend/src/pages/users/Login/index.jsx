import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { validateGeneral } from "../../../utils/validate";
import { loginAPI } from "../../../api/auth/request";

export default function Login() {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const rules = {
    username: { required: true, message: "Vui lòng nhập tên đăng nhập" },
    password: { required: true, minLength: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
  };

  // Khi người dùng nhập input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  //  Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateGeneral(formData, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI(formData);

      // Nếu Laravel trả về token
      if (res?.token) {
        localStorage.setItem("token", res.token);
        alert("Đăng nhập thành công!");
        window.location.href = "/";
      } else {
        alert("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng!";
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng nhập</h2>

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
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm">
                Hiển thị mật khẩu
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-500 text-white py-2 rounded-xl shadow-md hover:bg-red-600 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>
            <Link to="/quen-mat-khau" className="text-red-500 hover:underline">
              Quên mật khẩu?
            </Link>
          </p>
          <p className="mt-1">
            Chưa có tài khoản?{" "}
            <Link to="/dang-ky" className="text-red-500 hover:underline">
              Tạo tài khoản
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            className="flex items-center border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="mr-2" size={24} />
            Tiếp tục với Google
          </button>
        </div>
      </div>
    </div>
  );
}
