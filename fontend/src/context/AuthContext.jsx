/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { loginAPI, logoutAPI, getCurrentUser } from "../api/auth/request";
import { useNavigate } from "react-router-dom";
import userUnknown from "../assets/users/images/user/user.png";

const AuthContext = createContext();

/**
 * AuthProvider: Quản lý toàn bộ trạng thái đăng nhập
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage khi load app
  const [user, setUser] = useState(() => {
    const account_id = localStorage.getItem("account_id");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");
    const role = localStorage.getItem("role");

    return token && username
      ? { account_id: Number(account_id), token, username, avatar, role }
      : null;
  });

  const isAuthenticated = !!user?.token;

  /**
   * login: gọi API login, lưu token + user info vào localStorage và context
   * @param {Object} credentials { username, password }
   */
  const login = async (credentials) => {
    const res = await loginAPI(credentials);

    if (res?.token && res?.user) {
      const {
        id: account_id,
        username,
        account_type_id,
        status,
        avatar,
      } = res.user;
      const token = res.token;

      if (status === 0) {
        throw new Error("Tài khoản của bạn đã bị ngừng hoạt động");
      }

      // map role theo account_type_id
      const roleMap = {
        1: "admin",
        2: "nhân viên",
        3: "khách hàng",
      };
      const role = roleMap[account_type_id] || "khách hàng";

      const avatarUrl = avatar || userUnknown;

      // Lưu thông tin vào localStorage
      localStorage.setItem("account_id", account_id);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("avatar", avatarUrl);
      localStorage.setItem("role", role);

      // Cập nhật state context
      const userData = { account_id, token, username, avatar: avatarUrl, role };
      setUser(userData);

      // Đồng bộ giữa các tab
      window.dispatchEvent(new Event("storage"));

      return userData;
    } else {
      throw new Error("Dữ liệu phản hồi không hợp lệ khi đăng nhập");
    }
  };

  /**
   * logout: gọi API logout và xóa token + user info
   */
  const logout = async () => {
    try {
      if (user?.token) await logoutAPI(user.token);
    } catch (err) {
      console.warn("Lỗi logout:", err);
    }

    // Xóa toàn bộ localStorage
    ["account_id", "token", "username", "avatar", "role"].forEach((k) =>
      localStorage.removeItem(k)
    );

    setUser(null);
    navigate("/dang-nhap");
  };

  /**
   * Đồng bộ giữa các tab: khi localStorage thay đổi
   */
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "chatbot_clear") {
        localStorage.removeItem("chat_history_v1");
      }
      const account_id = localStorage.getItem("account_id");
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const avatar = localStorage.getItem("avatar");
      const role = localStorage.getItem("role");

      if (token && username) {
        setUser({
          account_id: Number(account_id),
          token,
          username,
          avatar,
          role,
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /**
   * Tự động refresh thông tin user từ backend khi có token
   */
  useEffect(() => {
    const initUser = async () => {
      if (user?.token) {
        try {
          const res = await getCurrentUser(user.token);
          const {
            id: account_id,
            username,
            account_type_id,
            avatar,
            status,
          } = res;
          if (status === 0) {
            logout();
            return;
          }
          const roleMap = { 1: "admin", 2: "nhân viên", 3: "khách hàng" };
          const role = roleMap[account_type_id] || "khách hàng";
          const avatarUrl = avatar || userUnknown;

          setUser({
            account_id,
            username,
            avatar: avatarUrl,
            role,
            token: user.token,
          });
        } catch (err) {
          console.warn("Không thể refresh user:", err);
          logout();
        }
      }
    };

    initUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook tiện lợi
export const useAuth = () => useContext(AuthContext);
