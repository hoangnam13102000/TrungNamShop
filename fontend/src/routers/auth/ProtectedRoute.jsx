/* eslint-disable react-refresh/only-export-components */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFound from "../../pages/404";

/**
 * ProtectedRoute
 * - Dùng cho bất kỳ route nào cần login
 * - roles: mảng role được phép truy cập (chuỗi lowercase, ví dụ ["admin", "nhân viên"])
 */
export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Nếu chưa login → redirect tới trang login
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  // Nếu có role giới hạn mà user không thuộc → redirect về home
  if (roles.length > 0 && !roles.includes(user?.role?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  // Nếu hợp lệ → render component
  return children;
};

/**
 * ProtectedAdminRoute
 * - Chỉ cho admin hoặc nhân viên truy cập
 * - Nếu chưa login → redirect /dang-nhap
 * - Nếu là khách hàng → hiển thị 404
 */
export const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // Chưa login → redirect login
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace />;
  }

  // Nếu là khách hàng → hiển thị 404
  if (user?.role?.toLowerCase() === "khách hàng") {
    return <NotFound />;
  }

  // Admin hoặc nhân viên → render component
  return children;
};
