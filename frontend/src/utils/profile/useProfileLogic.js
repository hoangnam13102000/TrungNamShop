import { useState, useEffect } from "react";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import placeholder from "../../assets/admin/logoicon1.jpg";

export function useProfileLogic() {
  const accountId = localStorage.getItem("account_id");

  /* ======================
   * API
   * ====================== */
  const customerAPI = useCRUDApi("customers");
  const employeeAPI = useCRUDApi("employees");

  const { data: customers = [], refetch: refetchCustomers } = customerAPI.useGetAll();
  const { data: employees = [], refetch: refetchEmployees } = employeeAPI.useGetAll();

  const customerUpdateMutation = customerAPI.useUpdate();
  const employeeUpdateMutation = employeeAPI.useUpdate();

  /* ======================
   * STATE
   * ====================== */
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [dialog, setDialog] = useState({ open: false });

  const API = import.meta.env.VITE_API_URL;

  /* ======================
   * LOAD PROFILE
   * ====================== */
  useEffect(() => {
    if (!accountId) return;

    let profile;
    let accountType;

    // Nếu đã xác định account_type thì ưu tiên bảng đó
    if (profileData?.account_type === "employee") {
      profile = employees.find(e => e.account_id == accountId);
      accountType = "employee";
    } else if (profileData?.account_type === "customer") {
      profile = customers.find(c => c.account_id == accountId);
      accountType = "customer";
    } else {
      // Lần đầu load
      profile = employees.find(e => e.account_id == accountId);
      accountType = profile ? "employee" : "customer";
      if (!profile) profile = customers.find(c => c.account_id == accountId);
    }

    if (!profile) return;

    setProfileData({
      ...profile,
      account_type: accountType,
      email: profile.account?.email || "",
      avatar: profile.avatar ? getImageUrl(profile.avatar) : placeholder,
    });
  }, [customers, employees, accountId]);

  /* ======================
   * FORM FIELDS
   * ====================== */
  const fields = [
    { name: "full_name", label: "Họ và tên", type: "text", required: true },
    { name: "email", label: "Email", type: "text" },
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
    {
      name: "avatar",
      label: "Ảnh đại diện",
      type: isEditing ? "file" : "custom-image",
    },
  ];

  const passwordFields = [
    { name: "current_password", label: "Mật khẩu hiện tại", type: "password", required: true },
    { name: "new_password", label: "Mật khẩu mới", type: "password", required: true },
    { name: "confirm_password", label: "Xác nhận mật khẩu", type: "password", required: true },
  ];

  /* ======================
   * SAVE PROFILE
   * ====================== */
  const handleSave = async (data) => {
    if (!profileData) return;

    const updateMutation =
      profileData.account_type === "employee"
        ? employeeUpdateMutation
        : customerUpdateMutation;

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null) return;

      if (key === "avatar") {
        if (data.avatar instanceof File) {
          formData.append("avatar", data.avatar);
        }
        return;
      }

      formData.append(key, data[key]);
    });

    setDialog({
      open: true,
      mode: "confirm",
      title: "Xác nhận",
      message: "Bạn có chắc chắn muốn cập nhật thông tin?",
      onConfirm: async () => {
        try {
          const updated = await updateMutation.mutateAsync({
            id: profileData.id,
            data: formData,
          });

          setProfileData({
            ...updated,
            account_type: profileData.account_type,
            email: updated.account?.email || "",
            avatar: updated.avatar ? getImageUrl(updated.avatar) : placeholder,
          });

          setIsEditing(false);

          // Chỉ refetch bảng tương ứng
          if (profileData.account_type === "employee") {
            refetchEmployees();
          } else {
            refetchCustomers();
          }

          setDialog({
            open: true,
            mode: "success",
            title: "Thành công",
            message: "Cập nhật thông tin thành công!",
            onClose: () => setDialog({ open: false }),
          });
        } catch (err) {
          setDialog({
            open: true,
            mode: "error",
            title: "Lỗi",
            message: err?.response?.data?.message || "Cập nhật thất bại",
            onClose: () => setDialog({ open: false }),
          });
        }
      },
      onClose: () => setDialog({ open: false }),
    });
  };

  /* ======================
   * CHANGE PASSWORD
   * ====================== */
  const handleChangePassword = async (data) => {
    if (data.new_password !== data.confirm_password) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Mật khẩu không khớp",
        onClose: () => setDialog({ open: false }),
      });
      return;
    }

    setDialog({
      open: true,
      mode: "confirm",
      title: "Đổi mật khẩu",
      message: "Bạn có chắc chắn muốn đổi mật khẩu?",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");

          const res = await fetch(`${API}/change-password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              current_password: data.current_password,
              new_password: data.new_password,
              new_password_confirmation: data.confirm_password,
            }),
          });

          const result = await res.json();
          if (!res.ok) throw new Error(result.message);

          setIsChangingPassword(false);
          setDialog({
            open: true,
            mode: "success",
            title: "Thành công",
            message: result.message,
            onClose: () => setDialog({ open: false }),
          });
        } catch (err) {
          setDialog({
            open: true,
            mode: "error",
            title: "Lỗi",
            message: err.message || "Đổi mật khẩu thất bại",
            onClose: () => setDialog({ open: false }),
          });
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
    fields,
    passwordFields,
    handleSave,
    handleChangePassword,
    isLoading: !profileData,
  };
}
