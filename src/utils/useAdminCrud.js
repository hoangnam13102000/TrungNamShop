import { useState } from "react";

export default function useAdminCrud(initialData = []) {
  const [items, setItems] = useState(initialData);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Delete
  const handleDelete = (itemOrId) => {
    const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    if (window.confirm("Bạn có chắc chắn muốn xoá mục này không?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Save
  const handleSave = (data) => {
    if (data.id) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.id ? { ...item, ...data, image: data.image || item.image } : item
        )
      );
    } else {
      setItems((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  // Edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Add 
  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // ✅ Filter theo tất cả giá trị có thể tìm được
  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return {
    items,
    setItems,
    editingItem,
    showForm,
    search,
    setSearch,
    filteredItems,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,
  };
}
