import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

/** =========================
 *  Helper: Kiểm tra File
 * ========================= */
const isFile = (value) => value instanceof File || value instanceof Blob;

/** =========================
 *  Helper: Convert FormData
 * ========================= */
const toFormData = (data) => {
  const fd = new FormData();
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      if (typeof data[key] === "object" && !(data[key] instanceof File)) {
        fd.append(key, JSON.stringify(data[key]));
      } else {
        fd.append(key, data[key]);
      }
    }
  }

  // Log tất cả cặp key/value của FormData
  console.log("=== FormData Contents ===");
  for (const pair of fd.entries()) {
    console.log(pair[0], ":", pair[1]);
  }
  console.log("=========================");

  return fd;
};

/** =========================
 *  useAdminCrud Hook
 * ========================= */
export default function useAdminCrud(api, queryKey) {
  const queryClient = useQueryClient();

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  /** =========================
   *  ADD / EDIT / CLOSE FORM
   * ========================= */
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

  /** =========================
   *  DELETE ITEM
   * ========================= */
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      console.log("==> Đang xoá item id:", id);

      if (api.deleteMutation) await api.deleteMutation.mutateAsync(id);
      else if (api.delete) await api.delete(id);
      else throw new Error("Không tìm thấy hàm delete hoặc deleteMutation");

      console.log("✅ Xoá thành công id:", id);
      await queryClient.invalidateQueries([queryKey]);
    } catch (err) {
      console.error("❌ Delete error chi tiết:", err.response?.data || err.message);
      if (err.response?.status === 422) {
        console.error("💡 Backend trả về lỗi 422 (Unprocessable Content):", err.response.data);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** =========================
   *  SAVE ITEM (CREATE / UPDATE)
   * ========================= */
  const handleSave = async (formData) => {
    try {
      setLoading(true);

      if (!formData || typeof formData !== "object") {
        throw new Error("handleSave: formData is required and must be an object");
      }

      const hasFile = Object.values(formData).some(isFile);
      const payload = hasFile ? toFormData(formData) : formData;

      console.log("==> Payload gửi đi:", payload);

      if (mode === "edit") {
        if (!selectedItem?.id) throw new Error("Không có item để cập nhật");
        console.log("==> Đang cập nhật id:", selectedItem.id);

        if (api.updateMutation) {
          await api.updateMutation.mutateAsync({ id: selectedItem.id, data: payload });
        } else if (api.update) {
          await api.update(selectedItem.id, payload);
        } else {
          throw new Error("Không tìm thấy hàm update hoặc updateMutation");
        }

        console.log("✅ Cập nhật thành công id:", selectedItem.id);
      } else {
        console.log("==> Đang tạo item mới");
        if (api.createMutation) {
          await api.createMutation.mutateAsync(payload);
        } else if (api.create) {
          await api.create(payload);
        } else {
          throw new Error("Không tìm thấy hàm create hoặc createMutation");
        }
        console.log("✅ Tạo mới thành công");
      }

      await queryClient.invalidateQueries([queryKey]);
      handleCloseForm();
    } catch (err) {
      console.error("❌ Save error chi tiết:", err.response?.data || err.message);
      if (err.response?.status === 422) {
        console.error("💡 Backend trả về lỗi 422 (Unprocessable Content):", err.response.data);
      }
      throw err;
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
