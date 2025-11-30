import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FaLock, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const username = searchParams.get("username");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          username,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setError("");

        // Redirect về trang đăng nhập sau 2 giây
        setTimeout(() => {
          navigate("/dang-nhap");
        }, 2000);
      } else {
        setError(data.message || "Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      console.error("Lỗi reset mật khẩu:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header gradient bar */}
        <div className="h-2 bg-gradient-to-r from-red-600 to-red-700"></div>
        
        <div className="p-8">
          {/* Icon and title */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-full mb-4 shadow-lg">
              <FaLock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">Đặt lại mật khẩu</h2>
            <p className="text-gray-500 text-sm mt-2 text-center">Nhập mật khẩu mới của bạn</p>
          </div>

          {/* Password inputs */}
          <div className="space-y-4 mb-6">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 transition-colors bg-gray-50 hover:bg-white"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-600 transition-colors bg-gray-50 hover:bg-white"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>

          {/* Success message */}
          {message && (
            <div className="mt-5 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
              <FaCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 font-medium text-sm">{message}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-5 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
              <FaExclamationCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link 
              to="/dang-nhap" 
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;