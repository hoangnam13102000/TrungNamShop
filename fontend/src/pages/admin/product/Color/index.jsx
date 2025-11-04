import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi"; 

export default memo(function ColorManagement() {
  /** ==========================
   *  1. FETCH DATA
   *  ========================== */
  const colorApi = useCRUDApi("colors"); 

  const { data: colors = [], isLoading, refetch } = colorApi.useGetAll();

  /** ==========================
   *  2. CRUD MUTATIONS
   *  ========================== */
  const createMutation = colorApi.useCreate();
  const updateMutation = colorApi.useUpdate();
  const deleteMutation = colorApi.useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "colors"
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
    return colors.filter((c) =>
      (c.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [colors, search]);

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
      <h1 className="text-2xl font-semibold mb-6">Quản lý màu sắc</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm màu sắc
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm màu sắc..."
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
            columns={[{ field: "name", label: "Tên màu sắc" }]}
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
          title={`Chi tiết màu sắc - ${viewItem.name}`}
          fields={[{ name: "name", label: "Tên màu sắc", type: "text" }]}
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
              ? `Chỉnh sửa màu sắc - ${crud.selectedItem?.name}`
              : "Thêm màu sắc"
          }
          fields={[
            {
              name: "name",
              label: "Tên màu sắc",
              type: "text",
              required: true,
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
