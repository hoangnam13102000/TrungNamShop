import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

export default memo(function AdminMemoryPage() {
  /** ==========================
   *  1. HOOK CRUD API
   * ========================== */
  const { useGetAll, useCreate, useUpdate, useDelete } = useCRUDApi("memories");

  /** ==========================
   *  2. FETCH DATA
   * ========================== */
  const { data: memories = [], isLoading, refetch } = useGetAll();

  /** ==========================
   *  3. CRUD MUTATIONS
   * ========================== */
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation?.mutateAsync,
      update: async (id, data) => updateMutation?.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation?.mutateAsync({ id }),
    },
    "memories"
  );

  /** ==========================
   *  4. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.ram || "Không rõ"
  );

  /** ==========================
   *  5. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return memories.filter((m) =>
      m.ram?.toLowerCase().includes(search.toLowerCase())
    );
  }, [memories, search]);

  /** ==========================
   *  6. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý Bộ nhớ</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm bộ nhớ
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo RAM..."
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
              { field: "ram", label: "Dung lượng RAM" },
              { field: "internal_storage", label: "Bộ nhớ trong" },
              { field: "memory_card_slot", label: "Khe cắm thẻ nhớ" },
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
          title={crud.mode === "edit" ? "Sửa bộ nhớ" : "Thêm bộ nhớ"}
          fields={[
            { name: "ram", label: "Dung lượng RAM", type: "text", required: true },
            {
              name: "internal_storage",
              label: "Bộ nhớ trong",
              type: "text",
              required: true,
            },
            { name: "memory_card_slot", label: "Khe cắm thẻ nhớ", type: "text" },
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
