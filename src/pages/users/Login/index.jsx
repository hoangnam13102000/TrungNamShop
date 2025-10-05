// src/Login.jsx
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập
    console.log({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
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
            className="w-full bg-red-500 text-white py-2 rounded-xl shadow-md hover:bg-red-600 transition"
          >
            ĐĂNG NHẬP
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
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
        </div>
        <div className="mt-6 flex items-center justify-center">
          <button className="flex items-center border px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            <FcGoogle className="mr-2" size={24} />
            Tiếp tục với Google
          </button>
        </div>
      </div>
    </div>
  );
}
