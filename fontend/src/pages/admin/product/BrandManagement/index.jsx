import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler"; 
import placeholder from "../../../../assets/admin/logoicon1.jpg";
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from "../../../../api/brand";

export default memo(function BrandManagement() {
  /** ==========================
   *  1. FETCH DATA
   *  ========================== */
  const { data: brands = [], isLoading, refetch } = useBrands();

  /** ==========================
   *  2. CRUD MUTATIONS
   *  ========================== */
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "brands"
  );

  /** ==========================
   *  3. ADMIN HANDLER
   *  ========================== */
  const {
    dialog,
    closeDialog,
    handleSave: handleSaveAdmin,
    handleDelete: handleDeleteAdmin,
  } = useAdminHandler(crud, refetch);

  /** ==========================
   *  4. STATE
   *  ========================== */
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  /** ==========================
   *  5. FILTER DATA
   *  ========================== */
  const filteredItems = useMemo(() => {
    return brands.filter((b) =>
      (b.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [brands, search]);

  /** ==========================
   *  6. HANDLERS
   *  ========================== */

  const handleSave = (formData) => {
    handleSaveAdmin(formData, { name: "name" });
  };
  const handleDelete = (item) => {
    handleDeleteAdmin(item, "name");
  };

  /** ==========================
   *  7. UI RENDER
   *  ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thương hiệu</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm thương hiệu
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
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
        </div>
      )}

      {/* FORM: VIEW */}
      {viewItem && (
        <DynamicForm
          mode="view"
          title={`Chi tiết thương hiệu - ${viewItem.name}`}
          fields={[
            { name: "name", label: "Tên thương hiệu", type: "text" },
            { name: "image", label: "Hình ảnh đại diện", type: "file" },
          ]}
          initialData={viewItem}
          onClose={() => setViewItem(null)}
          className="w-full max-w-lg mx-auto"
        />
      )}

      {/* FORM: EDIT / CREATE */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Chỉnh sửa thương hiệu - ${crud.selectedItem?.name}`
              : "Thêm thương hiệu"
          }
          fields={[
            {
              name: "name",
              label: "Tên thương hiệu",
              type: "text",
              required: true,
            },
            {
              name: "image",
              label: "Hình ảnh đại diện",
              type: "file",
              required: crud.mode === "create",
            },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          className="w-full max-w-lg mx-auto"
        />
      )}

      {/* DIALOG */}
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
