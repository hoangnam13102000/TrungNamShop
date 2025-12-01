import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

export default function PayPalButton({ orderId, totalAmount }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!orderId) return <p>Tạo đơn hàng trước khi thanh toán!</p>;

  return (
    <PayPalButtons
      createOrder={() => {
        return axios.post(`${apiBaseUrl}/paypal/create`, {
          orderId,
          amount: totalAmount,
        })
        .then(res => res.data.id);
      }}

      onApprove={(data) => {
        return axios.post(`${apiBaseUrl}/paypal/capture`, {
          orderId,
          paypalOrderId: data.orderID,
        })
        .then(() => {
          localStorage.removeItem("cart");
          alert("Thanh toán thành công!");
          window.location.href = "/gio-hang";
        })
        .catch(err => {
          console.error(err.response?.data || err);
          alert("Xác nhận thanh toán thất bại!");
        });
      }}

      onError={(err) => {
        console.error("PayPal Error:", err);
        alert("PayPal lỗi, thử lại sau.");
      }}
    />
  );
}
