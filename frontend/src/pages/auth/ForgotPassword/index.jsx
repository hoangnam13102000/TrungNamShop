import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import display from "@banner/Forgot-password.png";
import { validateGeneral } from "../../../utils/forms/validate";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateGeneral({ username }, { username: { required: true } });
    if (errors.username) return setError(errors.username);

    try {
      setLoading(true);
      const res = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        navigate(`/reset-mat-khau?token=${result.token}`);
      } else {
        setError(result.message);
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

        <div className="w-full md:w-1/2 bg-blue-50 flex items-center justify-center p-6">
          <img src={display} className="w-3/4" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-3">Quên mật khẩu</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-red-400"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 duration-200"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu đặt mật khẩu"}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link to="/dang-nhap" className="text-red-600 hover:underline text-sm">Quay lại đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
