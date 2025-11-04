import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi"; 

export default memo(function AdminUtilityManagementPage() {
  /** ==========================
   *  1. FETCH DATA
   * ========================== */
  const utilityApi = useCRUDApi("utilities"); 
  const { data: utilities = [], isLoading, refetch } = utilityApi.useGetAll();

  /** ==========================
   *  2. CRUD MUTATIONS
   * ========================== */
  const createMutation = utilityApi.useCreate();
  const updateMutation = utilityApi.useUpdate();
  const deleteMutation = utilityApi.useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "utilities"
  );

  /** ==========================
   *  3. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.special_features || "Không rõ"
  );

  /** ==========================
   *  4. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return utilities.filter((u) =>
      (u.special_features || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );
  }, [utilities, search]);

  /** ==========================
   *  5. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý tiện ích</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm tiện ích
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo tính năng..."
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
              { field: "advanced_security", label: "Bảo mật nâng cao" },
              { field: "special_features", label: "Tính năng đặc biệt" },
              { field: "water_dust_resistance", label: "Kháng nước bụi" },
            ]}
            data={filteredItems}
            actions={[
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
            ]}
          />
        </div>
      )}

      {/* FORM */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa tiện ích" : "Thêm tiện ích"}
          fields={[
            {
              name: "advanced_security",
              label: "Bảo mật nâng cao",
              type: "text",
            },
            {
              name: "special_features",
              label: "Tính năng đặc biệt",
              type: "text",
            },
            {
              name: "water_dust_resistance",
              label: "Kháng nước bụi",
              type: "text",
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
