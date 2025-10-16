import { useState, useMemo, useEffect } from "react";
import { validateGeneral } from "../utils/validate";

/**
 * General CRUD hook, used for many forms
 * @param {Array} initialData - Init Data 
 * @param {Object} options - {
 *   rules: object validation,
 *   api: { fetch, create, update, delete },
 *   hooks: { beforeSave: async (data, editingItem) => boolean }
 * }
 */
export default function useAdminCrud(initialData = [], options = {}) {
  const { rules = {}, api = {}, hooks = {} } = options;

  const [items, setItems] = useState(Array.isArray(initialData) ? initialData : []);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter theo search
  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    if (!search) return items;
    return items.filter((item) =>
      Object.values(item).some((v) =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [items, search]);

  // Fetch data from server
  const fetchData = async () => {
    if (!api.fetch) return;
    setLoading(true);
    try {
      const data = await api.fetch();
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save (create/update)
  const handleSave = async (data) => {
    if (!api.create || !api.update) return false;

    // Validate according to general rules
    const validationErrors = validateGeneral(data, rules);

    // Check existence: if field name exists, check for duplicates
    if (!editingItem && data.name) {
      const isDuplicate = items.some(
        (item) => item.name.toLowerCase() === data.name.toLowerCase()
      );
      if (isDuplicate) validationErrors.name = "Tên đã tồn tại";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    // beforeSave hook (confirm)
    if (hooks.beforeSave) {
      const ok = await hooks.beforeSave(data, editingItem);
      if (!ok) return false;
    }

    try {
      let res;
      if (editingItem) {
        res = await api.update(editingItem.id, data);
        setItems((prev) => (prev || []).map((i) => (i.id === editingItem.id ? res : i)));
      } else {
        res = await api.create(data);
        setItems((prev) => [...(prev || []), res]);
      }

      setShowForm(false);
      setEditingItem(null);
      setErrors({});
      return true;
    } catch (err) {
      console.error("Error saving:", err);
      return false;
    }
  };

  // Delete
  const handleDelete = async (itemOrId) => {
    if (!api.delete) return false;
    const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    try {
      await api.delete(id);
      setItems((prev) => (prev || []).filter((i) => i.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting:", err);
      return false;
    }
  };

  // Form control
  const handleEdit = (item) => {
    setEditingItem({ ...item });
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
    setErrors({});
  };

  return {
    items,
    setItems,
    editingItem,
    showForm,
    search,
    setSearch,
    filteredItems,
    errors,
    setErrors,
    loading,
    error,

    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseModal,
    fetchData,
  };
}
