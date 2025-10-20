import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const roleName = localStorage.getItem("roleName")?.toLowerCase().trim(); 

  if (!token) return <Navigate to="/dang-nhap" replace />;
  if (roleName === "khách hàng") return <Navigate to="/" replace />; 

  return <Outlet />; 
}
