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
  const [userType, setUserType] = useState(null); // 'customer' hoặc 'employee'

  const { useGetAll } = useCRUDApi("customers");
  const { data: customers = [], isLoading, refetch } = useGetAll();

  // Thêm hook để lấy danh sách employees
  const { useGetAll: useGetAllEmployees } = useCRUDApi("employees");
  const { data: employees = [], isLoading: isLoadingEmployees } = useGetAllEmployees();

  useEffect(() => {
    const accountId = Number(localStorage.getItem("account_id"));
    if (!accountId) {
      alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thanh toán.");
      setLoading(false);
      return;
    }

    if (!isLoading && !isLoadingEmployees && (customers.length > 0 || employees.length > 0)) {
      // Kiểm tra xem account_id là customer hay employee
      const customer = customers.find((c) => c.account_id === accountId);
      const employee = employees.find((e) => e.account_id === accountId);

      if (customer) {
        setUserType('customer');
        setCustomerId(customer.id);
        setCustomerInfo({
          name: customer.full_name || "",
          phone: customer.phone_number || "",
          address: customer.address || "",
          note: "",
        });
      } else if (employee) {
        setUserType('employee');
        setCustomerId(employee.id);
        setCustomerInfo({
          name: employee.full_name || "",
          phone: employee.phone_number || "",
          address: employee.address || "",
          note: "",
        });
      } else {
        alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      }
      setLoading(false);
    }
  }, [customers, employees, isLoading, isLoadingEmployees]);

  return { 
    customerInfo, 
    setCustomerInfo, 
    customerId, 
    loading, 
    refetch,
    userType
  };
};