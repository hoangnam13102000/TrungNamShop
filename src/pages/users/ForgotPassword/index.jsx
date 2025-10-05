import { useState } from "react";
import { Link } from "react-router-dom";
import display from "@banner/Forgot-password.png";
function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email gửi reset:", email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Hình minh họa */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center">
          <img
            src={display}
            alt="Quên mật khẩu"
            className="w-3/4 h-auto"
          />
        </div>

        {/* Form nhập email */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Quên mật khẩu</h2>
          <p className="text-center text-gray-600 mb-6 text-sm">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-xl shadow-md hover:bg-red-600 transition"
            >
              Gửi liên kết
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/dang-nhap" className="text-red-500 hover:underline text-sm">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
