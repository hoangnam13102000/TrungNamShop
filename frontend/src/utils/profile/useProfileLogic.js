// src/utils/hooks/useProfileLogic.js
import { useState, useEffect } from "react";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import placeholder from "../../assets/admin/logoicon1.jpg";

/**
 * Hook quản lý profile cho cả Customer và Employee
 */
export function useProfileLogic() {
  const accountId = localStorage.getItem("account_id");

  const customerAPI = useCRUDApi("customers");
  const employeeAPI = useCRUDApi("employees");

  const { data: customers = [], refetch: refetchCustomers } = customerAPI.useGetAll();
  const { data: employees = [], refetch: refetchEmployees } = employeeAPI.useGetAll();

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [dialog, setDialog] = useState({ open: false });

  const API = import.meta.env.VITE_API_URL; 
  // Lấy profile (customer hoặc employee)
  useEffect(() => {
    if (!accountId) return;

    let profile = customers.find(c => c.account_id == accountId)
               || employees.find(e => e.account_id == accountId);

    if (profile) {
      setProfileData({
        ...profile,
        avatarPreview: profile.avatar ? getImageUrl(profile.avatar) : placeholder,
        avatarFile: null,
      });
    }
  }, [customers, employees, accountId]);

  // Form fields profile
  const fields = [
    { name: "full_name", label: "Họ và tên", type: "text", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "phone_number", label: "Số điện thoại", type: "text" },
    { name: "birth_date", label: "Ngày sinh", type: "date" },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
      ],
    },
    { name: "address", label: "Địa chỉ", type: "textarea" },
    { name: "avatar", label: "Ảnh đại diện", type: isEditing ? "file" : "custom-image" },
  ];

  // Form đổi mật khẩu
  const passwordFields = [
    { name: "current_password", label: "Mật khẩu hiện tại", type: "password", required: true },
    { name: "new_password", label: "Mật khẩu mới", type: "password", required: true, minLength: 6 },
    { name: "confirm_password", label: "Xác nhận mật khẩu mới", type: "password", required: true },
  ];

  // Save profile
  const handleSave = async (data) => {
    if (!profileData) return;

    const api = profileData.account_type_id === "employee" ? employeeAPI : customerAPI;
    const updateMutation = api.useUpdate();

    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        if (key === "avatar" && data[key] instanceof File) {
          formData.append("avatar", data[key]);
        } else if (key !== "avatar") {
          formData.append(key, data[key]);
        }
      }
    }
    formData.append("account_id", profileData.account_id);

    setDialog({
      open: true,
      mode: "confirm",
      title: "Xác nhận cập nhật",
      message: `Bạn có chắc chắn muốn cập nhật thông tin của "${data.full_name}" không?`,
      onConfirm: async () => {
        try {
          const updated = await updateMutation.mutateAsync({ id: profileData.id, data: formData });

          setProfileData({
            ...updated,
            avatarPreview: updated.avatar ? getImageUrl(updated.avatar) : placeholder,
            avatarFile: null,
          });

          setIsEditing(false);
          refetchCustomers();
          refetchEmployees();

          setDialog({ open: true, mode: "success", title: "Cập nhật thành công", message: "Thông tin cá nhân đã được lưu!", onClose: () => setDialog({ open: false }) });
        } catch (error) {
          console.error("Lỗi cập nhật:", error);
          setDialog({ open: true, mode: "error", title: "Cập nhật thất bại", message: error?.response?.data?.message || "Không thể cập nhật thông tin.", onClose: () => setDialog({ open: false }) });
        }
      },
      onClose: () => setDialog({ open: false }),
    });
  };

  // Đổi mật khẩu
  const handleChangePassword = async (data) => {
    if (data.new_password !== data.confirm_password) {
      setDialog({ open: true, mode: "error", title: "Lỗi", message: "Mật khẩu mới không khớp!", onClose: () => setDialog({ open: false }) });
      return;
    }

    setDialog({
      open: true,
      mode: "confirm",
      title: "Xác nhận đổi mật khẩu",
      message: "Bạn có chắc chắn muốn đổi mật khẩu không?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API}/change-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              current_password: data.current_password,
              new_password: data.new_password,
              new_password_confirmation: data.confirm_password,
            }),
          });
          const result = await response.json();
          if (response.ok && result.success) {
            setIsChangingPassword(false);
            setDialog({ open: true, mode: "success", title: "Thành công", message: result.message, onClose: () => setDialog({ open: false }) });
          } else {
            throw new Error(result.message || "Đổi mật khẩu thất bại");
          }
        } catch (error) {
          console.error("Lỗi đổi mật khẩu:", error);
          setDialog({ open: true, mode: "error", title: "Lỗi", message: error.message || "Có lỗi xảy ra.", onClose: () => setDialog({ open: false }) });
        }
      },
      onClose: () => setDialog({ open: false }),
    });
  };

  return {
    profileData,
    isEditing,
    setIsEditing,
    isChangingPassword,
    setIsChangingPassword,
    dialog,
    setDialog,
    fields,
    passwordFields,
    handleSave,
    handleChangePassword,
  };
}
