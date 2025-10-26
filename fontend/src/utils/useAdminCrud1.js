import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

/** Kiểm tra giá trị có phải file upload không */
const isFile = (value) => value instanceof File || value instanceof Blob;

/** Chuyển object sang FormData (tự động stringify object con) */
const toFormData = (data) => {
  const fd = new FormData();
  for (const key in data) {
    const value = data[key];
    if (value !== undefined && value !== null) {
      if (typeof value === "object" && !isFile(value)) {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value);
      }
    }
  }
  return fd;
};

/** CRUD logic tổng quát cho Admin Panel */
export default function useAdminCrud1(api, queryKey) {
  const queryClient = useQueryClient();

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  /** ==========================
   *  FORM CONTROL
   * ========================== */
  const handleAdd = () => {
    setMode("create");
    setSelectedItem(null);
    setOpenForm(true);
  };

  const handleEdit = (item) => {
    setMode("edit");
    setSelectedItem(item);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedItem(null);
  };

  /** ==========================
   *  DELETE
   * ========================== */
  const handleDelete = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      if (api.deleteMutation) await api.deleteMutation.mutateAsync(id);
      else if (api.delete) await api.delete(id);

      await queryClient.invalidateQueries([queryKey]);
    } catch (err) {
      console.error("Delete error:", err);
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  /** ==========================
   *  SAVE (CREATE / UPDATE)
   * ========================== */
  const handleSave = async (formData) => {
    if (!formData || typeof formData !== "object") return;
    setLoading(true);

    try {
      // 🧩 Chuẩn hóa dữ liệu
      let payload = { ...formData };

      // Xử lý giá / số lượng (nếu nhập string)
      if (payload.price)
        payload.price = Number(String(payload.price).replace(/\D/g, "")) || 0;
      if (payload.stock_quantity)
        payload.stock_quantity = Number(payload.stock_quantity) || 0;

      // Giữ ảnh cũ khi không thay đổi
      if (
        mode === "edit" &&
        selectedItem &&
        selectedItem.image &&
        payload.image &&
        !isFile(payload.image)
      ) {
        delete payload.image;
      }

      // Nếu có file → chuyển sang FormData
      const hasFile = Object.values(payload).some(isFile);
      const finalData = hasFile ? toFormData(payload) : payload;

      // 🧠 Gọi API
      if (mode === "create") {
        if (api.createMutation) await api.createMutation.mutateAsync(finalData);
        else if (api.create) await api.create(finalData);
      } else {
        const id = selectedItem?.id;
        if (!id) throw new Error("Thiếu ID để cập nhật");

        if (api.updateMutation)
          await api.updateMutation.mutateAsync({ id, ...finalData });
        else if (api.update) await api.update(id, finalData);
      }

      await queryClient.invalidateQueries([queryKey]);
      handleCloseForm();
    } catch (err) {
      console.error("Save error:", err);
      throw err.response?.data || err;
    } finally {
      setLoading(false);
    }
  };

  return {
    openForm,
    mode,
    selectedItem,
    loading,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseForm,
  };
}
