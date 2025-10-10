import { useState } from "react";
import { validateGeneral } from "../utils/validate";

export default function useAdminCrud(initialData = [], rules = {}) {
  const [items, setItems] = useState(initialData);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false); 
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  // ======================
  //  CRUD Main
  // ======================
  const handleSave = (data) => {
    const validationErrors = validateGeneral(data, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    if (data.id) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.id ? { ...item, ...data } : item
        )
      );
    } else {
      setItems((prev) => [...prev, { ...data, id: Date.now() }]);
    }

    setShowForm(false);
    setEditingItem(null);
    setErrors({});
    return true;
  };

  const handleDelete = (itemOrId) => {
    const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    if (window.confirm("Bạn có chắc chắn muốn xoá mục này không?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
    setErrors({});
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    setErrors({});
    setViewMode(false);
  };

  // View
  const handleView = (item) => {
    setSelectedItem(item);
    setViewMode(true);
    setShowForm(true);
  };

  // Update Status
  const handleUpdateStatus = (item) => {
    setSelectedItem(item);
    setViewMode(false);
    setShowForm(true);
  };

  //Save
  const handleSaveStatus = (data) => {
    setItems((prev) =>
      prev.map((o) => (o.id === data.id ? { ...o, status: data.status } : o))
    );
    setShowForm(false);
    setSelectedItem(null);
  };

  // ======================
  // Filter and Search
  // ======================
  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return {
    items,
    setItems,
    editingItem,
    selectedItem,
    showForm,
    viewMode,
    search,
    setSearch,
    filteredItems,
    errors,
    setErrors,

    // CRUD
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,

    // View & Status
    handleView,
    handleUpdateStatus,
    handleSaveStatus,
  };
}
