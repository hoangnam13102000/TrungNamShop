import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import useAdminCrud from "../../../../utils/useAdminCrud";
import placeholder from "../../../../assets/admin/logoicon1.jpg";
import {
  getBrandsAPI,
  createBrandAPI,
  updateBrandAPI,
  deleteBrandAPI,
} from "../../../../api/brand/request";

export default function BrandManagement() {
  const [initialBrands, setInitialBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    filteredItems: brands,
    search,
    setSearch,
    showForm,
    editingItem,
    handleEdit,
    handleAdd,
    handleCloseModal,
    setItems,
  } = useAdminCrud(initialBrands);

  // Fetch brand list from API
  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const res = await getBrandsAPI();
      const data = Array.isArray(res.data) ? res.data : res;
      setInitialBrands(data);
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Save brand (create or update)
  const handleSave = async (data) => {
    try {
      let formDataToSend = data instanceof FormData ? data : new FormData();
      if (!(data instanceof FormData)) {
        Object.entries(data).forEach(([key, value]) =>
          formDataToSend.append(key, value)
        );
      }

      if (editingItem) {
        const updated = await updateBrandAPI(editingItem.id, formDataToSend);
        setItems((prev) =>
          prev.map((b) => (b.id === editingItem.id ? updated : b))
        );
      } else {
        const created = await createBrandAPI(formDataToSend);
        setItems((prev) => [...prev, created]);
      }

      await fetchBrands(); // Refresh list after saving
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save brand:", error);
    }
  };

  // Delete brand item
  const handleDeleteWithAPI = async (brand) => {
    try {
      await deleteBrandAPI(brand.id);
      setItems((prev) => prev.filter((b) => b.id !== brand.id));
      setInitialBrands((prev) => prev.filter((b) => b.id !== brand.id));
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thương hiệu</h1>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <button
          onClick={handleAdd}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <FaPlus />
          <span>Thêm thương hiệu</span>
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Brand table */}
      {isLoading ? (
        <p className="text-gray-500 italic">Đang tải dữ liệu...</p>
      ) : (
        <AdminListTable
          key={brands.length}
          columns={[
            { field: "name", label: "Tên thương hiệu" },
            {
              field: "image",
              label: "Hình ảnh",
              render: (value) => (
                <img
                  src={value}
                  alt="brand"
                  className="w-16 h-16 object-contain rounded"
                  onError={(e) => (e.target.src = {placeholder})}
                />
              ),
            },
          ]}
          data={brands}
          actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
            { icon: <FaTrash />, label: "Xóa", onClick: handleDeleteWithAPI },
          ]}
        />
      )}

      {/* Form modal for Add / Edit */}
      {showForm && (
        <DynamicForm
          title={editingItem ? "Sửa thương hiệu" : "Thêm thương hiệu"}
          fields={[
            { name: "name", label: "Tên thương hiệu", type: "text", required: true },
            {
              name: "image",
              label: "Hình ảnh đại diện",
              type: "file",
              required: !editingItem,
            },
          ]}
          initialData={editingItem}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
