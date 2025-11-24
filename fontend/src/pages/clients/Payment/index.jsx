import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCreditCard,
  FaBox,
} from "react-icons/fa";
import BreadCrumb from "../theme/BreadCrumb";
import { useCustomerInfo } from "../../../utils/hooks/useCustomerInfo";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import ChatWidget from "../../../components/Chats/ChatWidget";
import { useDiscount } from "../../../utils/payment/useDiscount";
import { useOrderHandler } from "../../../utils/payment/useOrderHandler";
import { useCartData } from "../../../utils/payment/useCartData";
import OrderSummary from "../../../components/payment/OrderSummary";
import CartItemPreview from "../../../components/payment/CartItemPreview";
import CustomerInfoForm from "../../../components/payment/CustomerInfoForm"; 

const Payment = () => {
  const { cartItems, getSubtotal, getCartItemImage } = useCartData();
  const { userType } = useCustomerInfo();
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
  });

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };
  const {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    getDiscountAmount,
    getTotal,
    applyDiscount,
    removeDiscount,
    isApplyingDiscount,
  } = useDiscount(getSubtotal, setDialog);
  const {
    customerInfo,
    errors,
    handleInputChange,
    handlePayment,
  } = useOrderHandler(cartItems, getTotal, appliedDiscount, setDialog);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb name="Thanh toán" />
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-5xl text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl font-semibold mb-2">
              Giỏ hàng của bạn trống
            </p>
            <p className="text-gray-500 mb-8">
              Hãy thêm sản phẩm để tiếp tục thanh toán
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <FaArrowLeft /> Quay lại mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <BreadCrumb name="Thanh toán" />

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg flex items-center justify-center">
                <FaCreditCard className="text-white text-lg" />
              </div>
              Hoàn tất đơn hàng
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Customer Info & Products) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer Info Card  */}
              <CustomerInfoForm
                customerInfo={customerInfo}
                errors={errors}
                handleInputChange={handleInputChange}
                userType={userType}
              />

              {/* CartItemPreview  */}
              <CartItemPreview 
                cartItems={cartItems} 
                getCartItemImage={getCartItemImage} 
              />
            </div>

            {/* Order Summary Sidebar  */}
            <OrderSummary
              getSubtotal={getSubtotal}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              appliedDiscount={appliedDiscount}
              getDiscountAmount={getDiscountAmount}
              getTotal={getTotal}
              applyDiscount={applyDiscount}
              removeDiscount={removeDiscount}
              isApplyingDiscount={isApplyingDiscount}
              handlePayment={handlePayment}
              cartItemsLength={cartItems.length}
            />
          </div>
        </div>
      </div>
      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
};

export default memo(Payment);