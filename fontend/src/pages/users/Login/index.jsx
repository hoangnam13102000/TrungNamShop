import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { validateGeneral } from "../../../utils/validate";
import { loginAPI } from "../../../api/auth/request";
import AuthWrapper from "../../../components/formAndDialog/AuthWapper";

export default function Login() {
  const navigate = useNavigate();

  const accountTypes = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Nhân viên" },
    { id: 3, name: "Khách hàng" },
  ];

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

      if (res?.token && res?.user) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("username", res.user.username);
        localStorage.setItem("avatar", res.user.avatar || "/default-avatar.png");

        const typeObj = accountTypes.find((t) => t.id === res.user.account_type_id);
        const roleName = typeObj ? typeObj.name.toLowerCase() : "";

        window.dispatchEvent(new Event("storage"));

        showAlert("success", "Đăng nhập thành công!", () => {
          if (roleName !== "khách hàng") navigate("/quan-tri");
          else navigate("/");
        });
      } else {
        showAlert("error", "Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Không thể kết nối đến máy chủ!";
      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper
      title="Đăng nhập"
      navigateTo={
        <>
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
        </>
      }
    >
      {({ showAlert }) => (
        <form onSubmit={(e) => handleSubmit(e, showAlert)} className="space-y-4">
          <div>
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
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
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
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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

          <div className="mt-6 flex items-center justify-center">
            <button type="button" className="flex items-center border px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              <FcGoogle className="mr-2" size={24} />
              Tiếp tục với Google
            </button>
          </div>
        </form>
      )}
    </AuthWrapper>
  );
}
