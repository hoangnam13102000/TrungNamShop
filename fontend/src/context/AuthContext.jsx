/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import { loginAPI, logoutAPI } from "../api/auth/request";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");
    const role = localStorage.getItem("role");
    return token && username ? { token, username, avatar, role } : null;
  });

  const isAuthenticated = !!user?.token;

  /**
   * Đăng nhập (lưu thông tin vào localStorage và state)
   */
  const login = async (credentials) => {
    const res = await loginAPI(credentials);
    if (res?.token && res?.user) {
      const token = res.token;
      const username = res.user.username;
      const avatar = res.user.avatar || "/default-avatar.png";
      const accountTypeId = res.user.account_type_id;

      // Define role from accountTypeId
      const roleMap = {
        1: "admin",
        2: "nhân viên",
        3: "khách hàng",
      };
      const role = roleMap[accountTypeId] || "khách hàng";

      // Save session
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("role", role);

      // Update state
      setUser({ token, username, avatar, role });

      window.dispatchEvent(new Event("storage"));

      return { token, username, role };
    } else {
      throw new Error("Đăng nhập thất bại: dữ liệu không hợp lệ");
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      if (user?.token) await logoutAPI(user.token);
    } catch (err) {
      console.warn("Lỗi khi gọi API logout:", err);
    }

    // Delete session
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    localStorage.removeItem("role");

    setUser(null);

    // Navigation to login page 
    navigate("/dang-nhap");
  };

  /**
   * Lắng nghe thay đổi storage (giúp đồng bộ trạng thái login/logout giữa các tab)
   */
  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const avatar = localStorage.getItem("avatar");
      const role = localStorage.getItem("role");
      if (token && username) {
        setUser({ token, username, avatar, role });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /**
   * Khi có token, có thể setup axios interceptor ở đây (tùy chọn)
   * để tự động gắn Authorization header cho tất cả request.
   */

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
