// src/utils/hooks/useOrderHandler.js
import { useState, useCallback } from "react";
import { validateGeneral } from "../../utils/forms/validate";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";
import { useCustomerInfo } from "../hooks/useCustomerInfo";

export const useOrderHandler = (cartItems, getTotal, appliedDiscount, setDialog) => {
  const { customerInfo, setCustomerInfo, customerId } = useCustomerInfo();
  const [errors, setErrors] = useState({});

  const { useCreate } = useCRUDApi("orders");
  const createOrder = useCreate();

  const API = import.meta.env.VITE_API_URL; 

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setCustomerInfo(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    },
    [setCustomerInfo, errors]
  );

  const handlePayment = useCallback(async () => {
    // 1. Validation
    const rules = {
      name: { required: true, message: "Vui lòng nhập họ và tên" },
      phone: { required: true, type: "phone", message: "Số điện thoại không hợp lệ" },
      address: { required: true, message: "Vui lòng nhập địa chỉ nhận hàng" },
      delivery_method: { required: true, message: "Vui lòng chọn phương thức giao hàng" },
      payment_method: { required: true, message: "Vui lòng chọn phương thức thanh toán" },
    };

    const validationErrors = validateGeneral(customerInfo, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2. Kiểm tra đăng nhập
    if (!customerId) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Bạn chưa đăng nhập. Vui lòng đăng nhập để thanh toán.",
      });
      return;
    }

    try {
      // 3. Chuẩn bị payload order
      const orderPayload = {
        order_code: `ORDER-${Date.now()}`,
        customer_id: Number(customerId),
        store_id: 1,
        discount_id: appliedDiscount?.id ? Number(appliedDiscount.id) : null,
        recipient_name: String(customerInfo.name),
        recipient_phone: String(customerInfo.phone),
        recipient_address: String(customerInfo.address),
        note: String(customerInfo.note || ""),
        delivery_method: String(customerInfo.delivery_method),
        payment_method: String(customerInfo.payment_method),
        payment_status: "unpaid",
        order_status: "pending",
        final_amount: Number(getTotal()),
        items: cartItems.map(item => ({
          product_detail_id: Number(item.id),
          product_name: String(item.name),
          detail_info: item.detail_info || null,
          quantity: Number(item.quantity),
          price_at_order: Number(item.final_price ?? item.price ?? 0),
          subtotal: Number(item.final_price ?? item.price ?? 0) * Number(item.quantity),
        })),
      };

      console.log("Payload gửi lên API:", JSON.stringify(orderPayload, null, 2));

      // 4. Tạo đơn hàng
      const orderRes = await createOrder.mutateAsync(orderPayload);
      const orderId = orderRes?.order?.id;
      if (!orderId) throw new Error("Không thể lấy ID đơn hàng từ server.");

      // 5. Xử lý thanh toán MoMo
      if (customerInfo.payment_method === "momo") {
        const payRes = await fetch(`${API}/momo/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        });
        const payData = await payRes.json();
        if (payData.payUrl || payData.payment_url) {
          window.location.href = payData.payUrl || payData.payment_url;
        } else {
          throw new Error("MoMo phản hồi không hợp lệ.");
        }
        return;
      }

      // 6. Xử lý thanh toán tiền mặt
      if (customerInfo.payment_method === "cash") {
        setDialog({
          open: true,
          mode: "success",
          title: "Đặt hàng thành công",
          message: "Đơn hàng đã được tạo. Bạn sẽ thanh toán khi nhận hàng.",
          onConfirm: () => {
            localStorage.removeItem("cart");
            window.location.href = "/gio-hang";
          },
        });
        return;
      }

      // 7. Xử lý PayPal
      if (customerInfo.payment_method === "paypal") {
        const payRes = await fetch(`${API}/paypal/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        });
        const payData = await payRes.json();
        if (payData.payment_url) {
          window.location.href = payData.payment_url; // redirect ngay sang PayPal
        } else {
          throw new Error("PayPal phản hồi không hợp lệ.");
        }
        return;
      }

    } catch (error) {
      console.error("Payment error:", error.response?.data || error);
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo đơn hàng.",
      });
    }
  }, [cartItems, customerId, customerInfo, appliedDiscount, createOrder, getTotal, setDialog, API]);

  return {
    customerInfo,
    errors,
    handleInputChange,
    handlePayment,
    customerId,
  };
};
