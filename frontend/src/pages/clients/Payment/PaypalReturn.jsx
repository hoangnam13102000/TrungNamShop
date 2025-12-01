import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";

export default function PaypalResult({ setCartItems }) {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onClose: null,
  });

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const openDialog = (mode, title, message, onClose) => {
    setDialog({
      open: true,
      mode,
      title,
      message,
      onClose: () => {
        setDialog((prev) => ({ ...prev, open: false }));
        if (onClose) onClose();
      },
    });
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems?.([]);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handlePaypalStatus = async (token, status) => {
    try {
      const response = await fetch(`${apiBaseUrl}/order-by-paypal/${token}`);
      const data = await response.json();
      setDialog((prev) => ({ ...prev, open: false }));

      if (!response.ok) throw new Error(data.message || "Lỗi từ server.");

      const orderId = data.order_id;

      if (status === "success" && data.payment_status === "paid") {
        clearCart();
        openDialog(
          "success",
          "Thanh toán thành công",
          `Đơn hàng #${orderId} đã được xác nhận.`,
          () => navigate("/gio-hang")
        );
      } else if (status === "canceled" || status === "failed") {
        openDialog(
          "warning",
          "Giao dịch thất bại ",
          `Đơn hàng #${orderId} chưa thanh toán.`,
          () => navigate("/gio-hang")
        );
      } else {
        openDialog(
          "error",
          "Trạng thái không rõ",
          `Đơn hàng #${orderId} có trạng thái thanh toán chưa rõ.`,
          () => navigate("/gio-hang")
        );
      }
    } catch (error) {
      console.error("PayPal Status Error:", error);
      openDialog("error", "Lỗi hệ thống", "Có lỗi khi kiểm tra đơn hàng.", () =>
        navigate("/ho-tro")
      );
    }
  };

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const query = new URLSearchParams(window.location.search);
    const status = query.get("status");
    const token = query.get("token");

    if (status && token) {
      handlePaypalStatus(token, status);
    } else {
      openDialog(
        "error",
        "Truy cập không hợp lệ",
        "Thiếu thông tin kết quả thanh toán.",
        () => navigate("/gio-hang")
      );
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg">Đang xử lý kết quả thanh toán PayPal...</p>
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={dialog.onClose}
      />
    </div>
  );
}
