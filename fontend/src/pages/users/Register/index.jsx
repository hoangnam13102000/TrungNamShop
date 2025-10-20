import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateGeneral } from "../../../utils/validate";
import { registerAPI } from "../../../api/auth/request";
import AuthWrapper from "../../../components/formAndDialog/AuthWapper";

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

  return (
    <AuthWrapper
      title="Đăng ký tài khoản"
      navigateTo={
        <>
          Đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="text-red-500 hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      {({ showAlert }) => {
        const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
          if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
              showAlert("success", "Đăng ký thành công! Chuyển đến trang đăng nhập...", () =>
                navigate("/dang-nhap")
              );
            } else {
              showAlert("error", "Đăng ký thất bại, vui lòng thử lại.");
            }
          } catch (error) {
            const msg = error.response?.data?.message || "Lỗi máy chủ!";
            showAlert("error", msg);
          } finally {
            setLoading(false);
          }
        };

        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

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
              className={`w-full bg-red-500 text-white py-2 rounded-xl shadow-md hover:bg-red-600 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
            </button>
          </form>
        );
      }}
    </AuthWrapper>
  );
}
