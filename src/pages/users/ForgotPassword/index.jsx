import { useState } from "react";
import { Link } from "react-router-dom";
import display from "@banner/Forgot-password.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email gửi reset:", email);
    alert("Liên kết đặt lại mật khẩu đã được gửi!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-200">
        {/* Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-50 p-4 md:p-8">
          <img
            src={display}
            alt="Quên mật khẩu"
            className="w-1/2 md:w-3/4 h-auto object-contain"
          />
        </div>

        {/* Form email */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Quên mật khẩu
          </h2>
          <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-red-700 active:scale-95 transition transform font-semibold"
            >
              Gửi liên kết
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/dang-nhap"
              className="text-red-600 hover:underline text-sm md:text-base"
            >
               Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
