import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { validateGeneral } from "../../../utils/forms/validate";
import { loginAPI } from "../../../api/auth/request";
import { useAuth } from "../../../context/AuthContext";
import AuthWrapper from "../../../components/formAndDialog/AuthWapper";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const accountRoles = {
    1: "admin",
    2: "nhân viên",
    3: "khách hàng",
  };

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = {
    username: { required: true, message: "Vui lòng nhập tên đăng nhập" },
    password: { required: true, minLength: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e, showAlert) => {
    e.preventDefault();

    const validationErrors = validateGeneral(formData, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI(formData);

      if (!res?.token || !res?.user) {
        showAlert("error", "Đăng nhập thất bại. Vui lòng thử lại!");
        return;
      }

      const { token, user } = res;
      const { username, account_type_id, status, avatar, id: account_id } = user;

      if (status === 0) {
        showAlert("error", "Tài khoản của bạn đã bị ngừng hoạt động!");
        return;
      }

      const role = accountRoles[account_type_id] || "khách hàng";
      const avatarUrl = avatar || "/default-avatar.png";

      // Lưu thông tin vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("account_id", account_id); 

      setUser({ username, avatar: avatarUrl, token, role, account_id });
      window.dispatchEvent(new Event("storage"));

      showAlert("success", "Đăng nhập thành công!", () => {
        if (role !== "khách hàng") navigate("/quan-tri");
        else navigate("/");
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Không thể kết nối đến máy chủ!";
      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper title="Đăng nhập">
      {({ showAlert }) => (
        <form onSubmit={(e) => handleSubmit(e, showAlert)} className="bg-white p-8 rounded-xl shadow-md space-y-4">
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
              errors.username ? "border-red-500" : ""
            }`}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          {/* Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {/* Show password */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
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
            <Link to="/quen-mat-khau" className="text-red-500 text-sm hover:text-red-600 transition">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit */}
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
      )}
    </AuthWrapper>
  );
}