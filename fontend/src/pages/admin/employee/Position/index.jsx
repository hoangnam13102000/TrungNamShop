import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler"; 

import {
  usePositions,
  useCreatePosition,
  useUpdatePosition,
  useDeletePosition,
} from "../../../../api/employee/position";

export default memo(function PositionManagement() {
  /** ==========================
   *  1️ FETCH DATA
   *  ========================== */
  const { data: positions = [], isLoading, isError, refetch } = usePositions();

  /** ==========================
   *  2 CRUD MUTATIONS
   *  ========================== */
  const createMutation = useCreatePosition();
  const updateMutation = useUpdatePosition();
  const deleteMutation = useDeletePosition();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "positions"
  );

  /** ==========================
   *  3 STATE + HANDLER HOOK
   *  ========================== */
  const [search, setSearch] = useState("");
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch);

  /** ==========================
   *  4 FILTER DATA
   *  ========================== */
  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return positions.filter(
      (pos) =>
        (pos.name ?? "").toLowerCase().includes(term) ||
        (pos.base_salary ?? "").toString().includes(term)
    );
  }, [positions, search]);

  /** ==========================
   *  5 UI RENDER
   *  ========================== */
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;

  if (isError)
    return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý chức vụ</h1>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm chức vụ
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc lương cơ bản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <AdminListTable
          columns={[
            { field: "name", label: "Tên chức vụ" },
            {
              field: "base_salary",
              label: "Lương cơ bản (VNĐ)",
              render: (value) =>
                Number(value ?? 0).toLocaleString("vi-VN") + " VNĐ",
            },
          ]}
          data={filteredItems}
          actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
            { icon: <FaTrash />, label: "Xoá", onClick: (item) => handleDelete(item, "name") },
          ]}
        />
      </div>

      {/* Form Add / Edit */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa chức vụ" : "Thêm chức vụ mới"}
          fields={[
            { name: "name", label: "Tên chức vụ", type: "text", required: true },
            {
              name: "base_salary",
              label: "Lương cơ bản (VNĐ)",
              type: "number",
              min: 0,
              required: true,
            },
          ]}
          initialData={crud.selectedItem}
          onSave={(data) => handleSave(data, { name: "name", money: "base_salary" })}
          onClose={crud.handleCloseForm}
          className="w-full max-w-lg mx-auto"
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
