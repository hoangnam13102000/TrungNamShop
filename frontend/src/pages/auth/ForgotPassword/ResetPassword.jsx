import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FaLock, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const API = import.meta.env.VITE_API_URL;

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token || !email) {
      setError("Link đặt lại mật khẩu không hợp lệ.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message || "Đặt lại mật khẩu thành công.");
        setTimeout(() => navigate("/dang-nhap"), 2000);
      } else {
        setError(data.message || "Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch {
      setError("Lỗi kết nối server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-red-600 to-red-700"></div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-full mb-4 shadow-lg">
              <FaLock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Đặt lại mật khẩu
            </h2>
            <p className="text-gray-500 text-sm mt-2">{email}</p>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-red-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg duration-200 disabled:opacity-60"
          >
            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>

          {message && (
            <div className="mt-5 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-5 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
              <FaExclamationCircle className="w-6 h-6 text-red-600" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/dang-nhap" className="text-red-600 hover:underline flex items-center gap-2 justify-center">
              <FaArrowLeft /> Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
