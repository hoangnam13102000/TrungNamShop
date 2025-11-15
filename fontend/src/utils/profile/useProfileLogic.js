import { useState, useEffect } from "react";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import placeholder from "../../assets/admin/logoicon1.jpg";
import { useAuth } from "../../context/AuthContext";

/**
 * Hook quản lý logic trang Profile
 */
export function useProfileLogic() {
  const { user } = useAuth();
  const accountId = user?.account_id;

  const { useGetAll, useUpdate } = useCRUDApi("customers");
  const { data: customers = [], isLoading, refetch } = useGetAll();
  const updateMutation = useUpdate();

  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [dialog, setDialog] = useState({ open: false });
  const [profileData, setProfileData] = useState(null);

  /** Lọc customer đúng account_id */
  useEffect(() => {
    if (customers.length > 0 && accountId) {
      const customer = customers.find(c => c.account_id === accountId);
      if (customer) {
        setProfileData({
          ...customer,
          avatarPreview: customer.avatar
            ? getImageUrl(customer.avatar)
            : placeholder,
          avatarFile: null,
        });
      }
    }
  }, [customers, accountId]);

  /** Cấu hình form fields */
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
    {
      name: "avatar",
      label: "Ảnh đại diện",
      type: isEditing ? "file" : "custom-image",
    },
  ];

  /** Xử lý save form */
  const handleSave = async (data) => {
    if (!profileData) return;

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
          const updated = await updateMutation.mutateAsync({
            id: profileData.id,
            data: formData,
          });

          setProfileData({
            ...updated,
            avatarPreview: updated.avatar
              ? getImageUrl(updated.avatar)
              : placeholder,
            avatarFile: null,
          });

          setIsEditing(false);
          refetch();

          setDialog({
            open: true,
            mode: "success",
            title: "Cập nhật thành công",
            message: "Thông tin cá nhân đã được lưu thành công!",
            onClose: () => setDialog({ open: false }),
          });
        } catch (error) {
          console.error("Lỗi cập nhật:", error);
          setDialog({
            open: true,
            mode: "error",
            title: "Cập nhật thất bại",
            message:
              error?.response?.data?.message ||
              "Không thể cập nhật thông tin, vui lòng thử lại.",
            onClose: () => setDialog({ open: false }),
          });
        }
      },
      onClose: () => setDialog({ open: false }),
    });
  };

  return {
    isEditing,
    setIsEditing,
    showHistory,
    setShowHistory,
    dialog,
    setDialog,
    profileData,
    isLoading,
    fields,
    handleSave,
  };
}
