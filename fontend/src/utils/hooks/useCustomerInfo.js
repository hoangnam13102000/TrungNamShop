import { useState, useEffect } from "react";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";

export const useCustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { useGetAll } = useCRUDApi("customers");
  const { data: customers = [], isLoading, refetch } = useGetAll();

  useEffect(() => {
    const accountId = Number(localStorage.getItem("account_id"));
    if (!accountId) {
      alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thanh toán.");
      setLoading(false);
      return;
    }

    if (!isLoading && customers.length > 0) {
      // Lọc customer theo account_id
      const customer = customers.find((c) => c.account_id === accountId);
      if (customer) {
        setCustomerId(customer.id);
        setCustomerInfo({
          name: customer.full_name || "",
          phone: customer.phone_number || "",
          address: customer.address || "",
          note: "",
        });
      } else {
        alert("Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.");
      }
      setLoading(false);
    }
  }, [customers, isLoading]);

  return { customerInfo, setCustomerInfo, customerId, loading, refetch };
};
