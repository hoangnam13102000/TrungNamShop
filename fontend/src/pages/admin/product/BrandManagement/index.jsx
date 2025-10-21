import { memo, useMemo, useState, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1"; // hook cũ nhưng đã tích hợp FormData tự động
import placeholder from "../../../../assets/admin/logoicon1.jpg";

import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "../../../../api/brand";

export default memo(function AdminBrandPage() {
  /** ==========================
   *  1. FETCH DATA
   * ========================== */
  const { data: brands = [], isLoading } = useBrands();

  /** ==========================
   *  2. CRUD HOOK
   * ========================== */
  const crud = useAdminCrud(
    {
      createMutation: useCreateBrand(),
      updateMutation: useUpdateBrand(),
      deleteMutation: useDeleteBrand(),
    },
    "brands"
  );

  /** ==========================
   *  3. DIALOG STATE
   * ========================== */
  const [search, setSearch] = useState("");
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

  const closeDialog = useCallback(() => setDialog((prev) => ({ ...prev, open: false })), []);

  /** ==========================
   *  4. FILTER DATA
   * ========================== */
  const filteredItems = useMemo(() => 
    brands.filter((b) =>
      b.name?.toLowerCase().includes(search.toLowerCase())
    ), 
    [brands, search]
  );

  /** ==========================
   *  5. HANDLE SAVE
   * ========================== */
  const handleSave = async (formData) => {
    if (!formData || typeof formData !== "object") return;

    showDialog(
      "confirm",
      "Xác nhận lưu",
      "Bạn có chắc muốn lưu thương hiệu này?",
      async () => {
        closeDialog();
        try {
          await crud.handleSave(formData); // hook cũ đã tự detect FormData
          showDialog("success", "Thành công", "Lưu thương hiệu thành công!");
        } catch (err) {
          console.error("Save error:", err);
          showDialog("error", "Lỗi", "Lưu thương hiệu thất bại!");
        }
      }
    );
  };

  /** ==========================
   *  6. HANDLE DELETE
   * ========================== */
  const handleDelete = (item) => {
    const name = item?.name ?? "Thương hiệu không tên";
    showDialog(
      "confirm",
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xoá "${name}" không?`,
      async () => {
        closeDialog();
        try {
          await crud.handleDelete(item.id);
          showDialog("success", "Thành công", "Đã xoá thương hiệu thành công!");
        } catch (err) {
          console.error("Delete error:", err);
          showDialog("error", "Lỗi", "Không thể xoá thương hiệu!");
        }
      }
    );
  };

  /** ==========================
   *  7. RENDER
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thương hiệu</h1>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <FaPlus /> Thêm thương hiệu
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-72"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <AdminListTable
          columns={[
            { field: "name", label: "Tên thương hiệu" },
            {
              field: "image",
              label: "Hình ảnh",
              render: (value) => (
                <img
                  src={value || placeholder}
                  alt="brand"
                  className="w-16 h-16 object-contain rounded"
                  onError={(e) => (e.target.src = placeholder)}
                />
              ),
            },
          ]}
          data={filteredItems}
          actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
            { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
          ]}
        />
      )}

      {/* Form */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa thương hiệu" : "Thêm thương hiệu"}
          fields={[
            { name: "name", label: "Tên thương hiệu", type: "text", required: true },
            { name: "image", label: "Hình ảnh đại diện", type: "file", required: crud.mode === "create" },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave} // chỉ cần truyền formData, hook tự xử lý FormData
          onClose={crud.handleCloseForm}
        />
      )}

      {/* Dialog */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
});
