import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

/** Check if value is a File/Blob */
const isFile = (value) => value instanceof File || value instanceof Blob;

/** Convert object → FormData (stringify nested object safely) */
const toFormData = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (isFile(value)) {
      fd.append(key, value);
    } else if (typeof value === "object") {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, value);
    }
  });
  return fd;
};

/** CRUD logic for Admin Panel */
export default function useAdminCrud1(api, queryKey) {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  /** FORM CONTROL */
  const handleAdd = () => {
    setMode("create");
    setSelectedItem(null);
    setOpenForm(true);
  };

  const handleEdit = (item) => {
    if (!item) return;
    setMode("edit");
    setSelectedItem(item);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedItem(null);
  };

  /** DELETE */
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

  /** SAVE (CREATE / UPDATE) */
  const handleSave = async (formData) => {
    if (!formData || typeof formData !== "object") return;

    setLoading(true);
    const id = selectedItem?.id;

    try {
      const payload = { ...formData };

      // Convert number fields
      if (payload.price) payload.price = Number(String(payload.price).replace(/\D/g, "")) || 0;
      if (payload.stock_quantity) payload.stock_quantity = Number(payload.stock_quantity) || 0;

      // File keys to consider for edit (avatar, image, etc.)
      const fileKeys = ["avatar", "image"];
      fileKeys.forEach((key) => {
        if (mode === "edit" && selectedItem?.[key] && !isFile(payload[key])) {
          delete payload[key]; // tránh gửi file cũ
        }
      });

      // Check if we need FormData
      const hasFile = Object.values(payload).some(isFile);
      const finalData = hasFile ? toFormData(payload) : payload;

      // Debug
      console.log("Final data sending:", hasFile ? [...finalData.entries()] : finalData);

      if (mode === "create") {
        // CREATE
        if (api.createMutation) await api.createMutation.mutateAsync(finalData);
        else await api.create(finalData);
      } else {
        // UPDATE
        if (!id) throw new Error("Thiếu ID để cập nhật");

        if (api.updateMutation) {
          await api.updateMutation.mutateAsync({ id, data: finalData });
        } else {
          try {
            await api.update(id, finalData);
          } catch {
            await api.update({ id, data: finalData });
          }
        }
      }

      await queryClient.invalidateQueries([queryKey]);
      handleCloseForm();
    } catch (err) {
      console.error("Save error:", err);
      if (err.response) console.error("Server Response:", err.response.data);
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
