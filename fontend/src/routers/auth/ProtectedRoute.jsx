/* eslint-disable react-refresh/only-export-components */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFound from "../../pages/404";

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not Login to Home Page
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user?.role?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * ProtectedAdminRoute — chỉ cho phép admin hoặc nhân viên vào
 * - Nếu chưa đăng nhập → /dang-nhap
 * - Nếu là khách hàng → 404
 */
export const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (user?.role?.toLowerCase() === "khách hàng") {
    return <NotFound />;
  }

  return children;
};
