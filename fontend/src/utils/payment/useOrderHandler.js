import { useState, useCallback } from "react";
import { validateGeneral } from "../../utils/forms/validate";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";
import { useCustomerInfo } from "../hooks/useCustomerInfo";

export const useOrderHandler = (cartItems, getTotal, appliedDiscount, setDialog) => {
  // Lấy thông tin khách hàng từ hook đã có
  const { customerInfo, setCustomerInfo, customerId } = useCustomerInfo();
  const [errors, setErrors] = useState({});

  // Hook API tạo đơn hàng
  const { useCreate } = useCRUDApi("orders");
  const createOrder = useCreate();

  // Hàm xử lý thay đổi input
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setCustomerInfo((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [setCustomerInfo, errors]
  );

  // Hàm xử lý thanh toán chính
  const handlePayment = useCallback(async () => {
    // 1. Định nghĩa Rule Validation và thực hiện Validation
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
      // 3. Chuẩn bị Payload đơn hàng
      const orderPayload = {
        order_code: `ORDER-${Date.now()}`,
        customer_id: customerId,
        store_id: 1,
        discount_id: appliedDiscount?.id || null,
        recipient_name: customerInfo.name,
        recipient_phone: customerInfo.phone,
        recipient_address: customerInfo.address,
        note: customerInfo.note || "",
        delivery_method: customerInfo.delivery_method,
        payment_method: customerInfo.payment_method,
        payment_status: "unpaid",
        order_status: "pending",
        final_amount: getTotal(),
        items: cartItems.map((item) => ({
          product_detail_id: item.id,
          product_name: item.name,
          detail_info: item.detail_info || null,
          quantity: item.quantity,
          price_at_order: Number(item.final_price ?? item.price ?? 0),
          subtotal: Number(item.final_price ?? item.price ?? 0) * item.quantity,
        })),
      };

      // 4. Gọi API tạo đơn hàng tạm thời
      const orderRes = await createOrder.mutateAsync(orderPayload);
      const orderId = orderRes?.order?.id;
      if (!orderId) throw new Error("Không thể lấy ID đơn hàng từ server.");

      // 5. Xử lý thanh toán MoMo
      if (customerInfo.payment_method === "momo") {
        const payRes = await fetch("http://127.0.0.1:8000/api/momo/payment", {
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
      }

      // 6. Thanh toán tiền mặt
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
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn/thanh toán:", error);
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: error.message || "Có lỗi xảy ra khi tạo đơn hàng.",
      });
    }
  }, [cartItems, customerId, customerInfo, appliedDiscount, createOrder, getTotal, setDialog]);

  return {
    customerInfo,
    errors,
    handleInputChange,
    handlePayment,
    customerId,
  };
};
