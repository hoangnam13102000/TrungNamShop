import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

export default function PayPalButton({ orderId, totalAmount }) {
  
  if (!orderId) return <p>Tạo đơn hàng trước khi thanh toán!</p>;

  return (
    <PayPalButtons
      createOrder={() => {
        return axios.post("http://127.0.0.1:8000/api/paypal/create", {
          orderId,
          amount: totalAmount,
        })
        .then(res => res.data.paypal_order_id); // server tạo orderID
      }}

      onApprove={(data) => {
        return axios.post("http://127.0.0.1:8000/api/paypal/capture", {
          orderId,
          paypalOrderId: data.orderID,
        })
        .then(() => {
          localStorage.removeItem("cart");
          window.location.href = "/gio-hang"; // clear cart & complete
        })
        .catch(err => alert("Capture lỗi!"));
      }}

      onError={() => alert("PayPal lỗi, thử lại")}
    />
  );
}
