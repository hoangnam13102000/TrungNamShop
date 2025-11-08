import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { loginAPI } from "../api/auth/request";

export default function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await loginAPI(formData);

      if (res?.token && res?.user) {
        const roleName = res.user.account_type_name?.toLowerCase().trim() || "";

        localStorage.setItem("token", res.token);
        localStorage.setItem("username", res.user.username);
        localStorage.setItem("avatar", res.user.avatar || "/default-avatar.png");
        localStorage.setItem("roleName", roleName);

        window.dispatchEvent(new Event("storage"));

        if (roleName !== "khách hàng") navigate("/quan-tri/dashboard");
        else navigate("/");
      } else {
        setErrors({ api: "Đăng nhập thất bại." });
      }
    } catch (err) {
      setErrors({ api: "Không thể kết nối đến server." });
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleSubmit} loading={loading} errors={errors} />;
}
