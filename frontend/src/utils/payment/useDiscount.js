// src/utils/hooks/useDiscount.js
import { useState, useCallback } from "react";

export const useDiscount = (getSubtotal, setDialog) => {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const API = import.meta.env.VITE_API_URL; 

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
      const res = await fetch(`${API}/discounts/validate?code=${discountCode}`, {
        method: "GET",
        credentials: "include",
      });
      const discountData = await res.json();

      if (res.ok && discountData.valid) {
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
        setAppliedDiscount(null); // reset nếu thất bại
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error);
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Có lỗi xảy ra khi áp dụng mã giảm giá",
      });
      setAppliedDiscount(null);
    } finally {
      setIsApplyingDiscount(false);
    }
  }, [discountCode, setDialog, API]);

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
