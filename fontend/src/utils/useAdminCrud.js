import { useState, useMemo } from "react";
import { validateGeneral } from "../utils/validate";

/**
 * useAdminCrud: hook CRUD tổng quát
 * @param {Array} initialData - dữ liệu khởi tạo
 * @param {Object} options - {
 *   rules: object validation,
 *   api: {
 *     fetch: async function để lấy data,
 *     create: async function(data),
 *     update: async function(id, data),
 *     delete: async function(id)
 *   }
 * }
 */
export default function useAdminCrud(initialData = [], options = {}) {
  const { rules = {}, api = {} } = options;

  const [items, setItems] = useState(Array.isArray(initialData) ? initialData : []);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  // ===== Filter theo search =====
  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    if (!search) return items;
    return items.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [items, search]);

  // ===== CRUD =====
  const handleSave = async (data) => {
    if (!api.create || !api.update) {
      console.warn("API create/update không được truyền vào hook");
      return false;
    }

    const validationErrors = validateGeneral(data, rules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    try {
      if (editingItem) {
        const res = await api.update(editingItem.id, data);
        setItems((prev) =>
          (prev || []).map((item) => (item.id === editingItem.id ? res : item))
        );
      } else {
        const res = await api.create(data);
        setItems((prev) => [...(prev || []), res]);
      }

      setShowForm(false);
      setEditingItem(null);
      setErrors({});
      return true;
    } catch (error) {
      console.error("Error saving item:", error);
      return false;
    }
  };

  const handleDelete = async (itemOrId) => {
    if (!api.delete) {
      console.warn("API delete không được truyền vào hook");
      return;
    }
    const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    if (window.confirm("Bạn có chắc chắn muốn xoá mục này không?")) {
      try {
        await api.delete(id);
        setItems((prev) => (prev || []).filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
      }
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

  const handleView = (item) => {
    setSelectedItem(item);
    setViewMode(true);
    setShowForm(true);
  };

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

    setShowForm,
    setEditingItem,

    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,
    handleView,
  };
}
