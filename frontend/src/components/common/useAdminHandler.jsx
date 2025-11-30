import { useState, useCallback } from "react";

export default function useAdminHandler(crud, refetch, getItemName) {
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    confirmText: "Xác nhận",
    cancelText: "Hủy",
    closeText: "Đóng",
    customButtons: null,
  });

  const showDialog = useCallback((mode, title, message, onConfirm = null, onCancel = null) => {
    setDialog((prev) => ({
      ...prev,
      open: true,
      mode,
      title,
      message,
      onConfirm,
      onCancel,
    }));
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const handleSave = async (formData, plainData = {}) => {
    const name = getItemName?.(formData) || formData?.name || "Không tên";

    showDialog(
      "confirm",
      crud.mode === "edit" ? "Xác nhận cập nhật" : "Xác nhận thêm mới",
      crud.mode === "edit"
        ? `Bạn có chắc chắn muốn cập nhật "${name}" không?`
        : `Bạn có chắc chắn muốn thêm "${name}" không?`,
      async () => {
        closeDialog();
        try {
          await crud.handleSave(formData, plainData);
          await refetch();
          showDialog(
            "success",
            "Thành công",
            crud.mode === "edit"
              ? `Cập nhật "${name}" thành công!`
              : `Thêm mới "${name}" thành công!`
          );
          setTimeout(() => closeDialog(), 2000);
        } catch (err) {
          console.error("Save error:", err);
          showDialog("error", "Lỗi", "Không thể lưu dữ liệu!");
        }
      },
      () => {
        closeDialog();
      }
    );
  };

  const handleDelete = async (item) => {
    const name = getItemName?.(item) || item?.name || "Không tên";

    showDialog(
      "confirm",
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xoá "${name}" không?`,
      async () => {
        closeDialog();
        try {
          await crud.handleDelete(item.id);
          await refetch();
          showDialog("success", "Thành công", `Đã xoá "${name}" thành công!`);
          setTimeout(() => closeDialog(), 2000);
        } catch (err) {
          console.error("Delete error:", err);
          showDialog("error", "Lỗi", "Không thể xoá dữ liệu!");
        }
      },
      () => {
        closeDialog();
      }
    );
  };

  return { dialog, showDialog, closeDialog, handleSave, handleDelete };
}
