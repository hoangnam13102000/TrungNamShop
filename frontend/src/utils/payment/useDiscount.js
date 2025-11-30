// src/utils/hooks/useDiscount.js
import { useState, useCallback } from "react";

export const useDiscount = (getSubtotal, setDialog) => {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);


  const getDiscountAmount = useCallback(() => {
    if (!appliedDiscount) return 0;
    const subtotal = getSubtotal();
    return (subtotal * appliedDiscount.percentage) / 100;
  }, [appliedDiscount, getSubtotal]);

 
  const getTotal = useCallback(() => {
    const subtotal = getSubtotal();
    return subtotal - getDiscountAmount();
  }, [getSubtotal, getDiscountAmount]);

  
  const applyDiscount = useCallback(async () => {
    if (!discountCode.trim()) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Vui lòng nhập mã giảm giá",
      });
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/discounts/validate?code=${discountCode}`
      );
      const discountData = await response.json();

      if (response.ok && discountData.valid) {
        setAppliedDiscount({
          id: discountData.discount.id,
          code: discountData.discount.code,
          percentage: discountData.discount.percentage,
        });
        setDialog({
          open: true,
          mode: "success",
          title: "Thành công",
          message: `Áp dụng mã giảm giá thành công! Giảm ${discountData.discount.percentage}%`,
        });
      } else {
        setDialog({
          open: true,
          mode: "error",
          title: "Lỗi",
          message: discountData.message || "Mã giảm giá không hợp lệ",
        });
        setAppliedDiscount(null); // Đảm bảo reset nếu thất bại
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error);
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Có lỗi xảy ra khi áp dụng mã giảm giá",
      });
      setAppliedDiscount(null); // Đảm bảo reset nếu có lỗi
    } finally {
      setIsApplyingDiscount(false);
    }
  }, [discountCode, setDialog]);

  // Logic xóa mã giảm giá
  const removeDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setDiscountCode("");
  }, []);

  return {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    getDiscountAmount,
    getTotal,
    applyDiscount,
    removeDiscount,
    isApplyingDiscount,
  };
};