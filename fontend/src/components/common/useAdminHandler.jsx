import { useState, useCallback } from "react";

export default function useAdminHandler(crud, refetch, getItemName) {
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
  });

  const showDialog = useCallback((mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  /** ========================
   *  SAVE HANDLER
   * ======================== */
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
            crud.mode === "edit" ? "Cập nhật thành công!" : "Thêm mới thành công!"
          );
        } catch (err) {
          console.error("Save error:", err);
          showDialog("error", "Lỗi", "Không thể lưu dữ liệu!");
        }
      }
    );
  };

  /** ========================
   *  DELETE HANDLER
   * ======================== */
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
          showDialog("success", "Thành công", "Đã xoá thành công!");
        } catch (err) {
          console.error("Delete error:", err);
          showDialog("error", "Lỗi", "Không thể xoá dữ liệu!");
        }
      }
    );
  };

  return {
    dialog,
    showDialog,
    closeDialog,
    handleSave,
    handleDelete,
  };
}
