import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";

export default function MomoResult({ setCartItems }) {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onClose: null,
  });

  const apiBaseUrl =import.meta.env.VITE_API_URL;

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

  const handleConfirmation = async (orderId, resultCode) => {
    try {
      const response = await fetch(`${apiBaseUrl}/momo/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: Number(orderId),
          result_code: resultCode,
        }),
      });

      const data = await response.json();

      setDialog((prev) => ({ ...prev, open: false }));

      if (!response.ok) {
        throw new Error(data.message || "Lỗi không xác định từ server.");
      }

      if (resultCode === "0") {
        clearCart();
        openDialog(
          "success",
          "Thanh toán thành công ",
          `Cảm ơn bạn! Đơn hàng #${orderId} đã được xác nhận và đang được xử lý.`,
          () => navigate("/gio-hang")
        );
      } else {
        openDialog(
          "warning",
          "Giao dịch bị Hủy/Thất bại ",
          `Đơn hàng #${orderId} đã được tạo nhưng giao dịch không thành công. Hệ thống đã chuyển đơn sang trạng thái Đã Hủy.`,
          () => navigate("/gio-hang")
        );
      }
    } catch (error) {
      console.error("API Confirmation Error:", error);

      setDialog((prev) => ({ ...prev, open: false }));

      openDialog(
        "error",
        "Lỗi Hệ thống Xác nhận",
        `Có lỗi xảy ra khi xác nhận đơn hàng. Vui lòng kiểm tra lại đơn hàng #${orderId} hoặc liên hệ hỗ trợ.`,
        () => navigate("/ho-tro")
      );
    }
  };

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const query = new URLSearchParams(window.location.search);
    const resultCode = query.get("resultCode");
    const orderId = query.get("orderId");

    if (orderId && resultCode !== null) {
      handleConfirmation(orderId, resultCode);
    } else {
      openDialog(
        "error",
        "Truy cập không hợp lệ",
        "Thiếu thông tin kết quả thanh toán. Vui lòng kiểm tra lại đơn hàng.",
        () => navigate("/gio-hang")
      );
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg">Đang xử lý kết quả thanh toán...</p>

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
