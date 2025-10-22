import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const isFile = (value) => value instanceof File || value instanceof Blob;

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
      let payload = { ...formData };

      // Giữ file cũ khi edit mà người dùng không thay đổi ảnh
      if (
        mode === "edit" &&
        selectedItem &&
        selectedItem.image &&
        payload.image &&
        !isFile(payload.image)
      ) {
        // Nếu formData.image là chuỗi hoặc URL (chưa thay đổi)
        delete payload.image; // backend sẽ giữ ảnh cũ
      }

      // Tự chuyển sang FormData nếu có file
      const hasFile = Object.values(payload).some(isFile);
      const finalData = hasFile ? toFormData(payload) : payload;

      // Gọi API
      if (mode === "create") {
        if (api.createMutation)
          await api.createMutation.mutateAsync(finalData);
        else if (api.create) await api.create(finalData);
      } else {
        const id = selectedItem?.id;
        if (!id) throw new Error("Thiếu ID để cập nhật");
        if (api.updateMutation)
          await api.updateMutation.mutateAsync({ id, data: finalData });
        else if (api.update) await api.update(id, finalData);
      }

      // Refresh lại danh sách
      await queryClient.invalidateQueries([queryKey]);
      handleCloseForm();
    } catch (err) {
      console.error(" Save error:", err);
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
