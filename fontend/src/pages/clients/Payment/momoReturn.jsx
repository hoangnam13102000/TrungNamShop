import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";

export default function PaymentResult({ setCartItems }) {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onClose: null,
  });

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const query = new URLSearchParams(window.location.search);
    const resultCode = query.get("resultCode");

    if (resultCode === "0") {
      // Thành công
      localStorage.removeItem("cart");
      if (setCartItems) setCartItems([]);

      setDialog({
        open: true,
        mode: "success",
        title: "Thanh toán thành công",
        message: "Cảm ơn bạn đã thanh toán qua MoMo!",
        onClose: () => {
          setDialog((p) => ({ ...p, open: false }));
          navigate("/gio-hang");
        },
      });
    } else {
      // Thất bại
      setDialog({
        open: true,
        mode: "error",
        title: "Thanh toán thất bại",
        message: "Giao dịch bị huỷ hoặc không thành công.",
        onClose: () => {
          setDialog((p) => ({ ...p, open: false }));
          navigate("/gio-hang");
        },
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Đang xử lý thanh toán...</p>

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
