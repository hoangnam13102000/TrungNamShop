import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import display from "@banner/Forgot-password.png";
import { validateGeneral } from "../../../utils/forms/validate";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate username
    const errors = validateGeneral(
      { username },
      { username: { required: true } }
    );
    if (Object.keys(errors).length > 0) {
      setError(errors.username);
      setSuccess("");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect sang trang ResetPassword, truyền username + token qua URL
        navigate(
          `/reset-mat-khau?username=${encodeURIComponent(
            username
          )}&token=${encodeURIComponent(result.token)}`
        );
      } else {
        setError(result.message || "Không thể gửi liên kết, vui lòng thử lại.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Lỗi gửi reset:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      setSuccess("");
    }
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

        {/* Form username */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Quên mật khẩu
          </h2>
          <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
            Nhập tên đăng nhập để đặt lại mật khẩu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-red-700 active:scale-95 transition transform font-semibold"
            >
              Gửi yêu cầu đặt lại mật khẩu
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
