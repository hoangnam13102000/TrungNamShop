import { useState } from "react";
import { Link } from "react-router-dom";
import display from "@banner/Forgot-password.png";
import { validateGeneral } from "../../../utils/forms/validate";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateGeneral(
      { email },
      { email: { required: true, email: true } }
    );

    if (errors.email) {
      setError(errors.email);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccess("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
        setEmail("");
      } else {
        setError(result.message || "Không thể gửi email.");
      }
    } catch {
      setError("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex md:flex-row flex-col overflow-hidden">

        {/* Image */}
        <div className="w-full md:w-1/2 bg-blue-50 flex items-center justify-center p-6">
          <img src={display} className="w-3/4" alt="Forgot password" />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-3">Quên mật khẩu</h2>
          <p className="text-center text-gray-500 mb-6">
            Nhập email đã đăng ký để nhận link đặt lại mật khẩu
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 duration-200 disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link to="/dang-nhap" className="text-red-600 hover:underline text-sm">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
