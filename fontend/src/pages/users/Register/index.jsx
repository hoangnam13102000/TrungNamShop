import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../../api/auth/request";
import AuthWrapper from "../../../components/formAndDialog/AuthWapper";
import { validateGeneral } from "../../../utils/validate";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
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
      await registerAPI({ username: formData.username, password: formData.password });
      showAlert("success", "Đăng ký thành công!", () => navigate("/dang-nhap"));
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi server!";
      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper title="Đăng ký" navigateTo={<></>}>
      {({ showAlert }) => (
        <form onSubmit={(e) => handleSubmit(e, showAlert)} className="space-y-4">
          <input type="text" name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} className="w-full border px-4 py-2 rounded"/>
          <input type={showPassword ? "text" : "password"} name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} className="w-full border px-4 py-2 rounded"/>
          <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Xác nhận mật khẩu" value={formData.confirmPassword} onChange={handleChange} className="w-full border px-4 py-2 rounded"/>
          <div className="flex items-center">
            <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2"/>
            <label>Hiển thị mật khẩu</label>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-500 text-white py-2 rounded">
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
      )}
    </AuthWrapper>
  );
}
