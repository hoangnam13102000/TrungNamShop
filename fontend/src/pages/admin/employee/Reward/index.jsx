import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const RewardManagement = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const rewardAPI = useCRUDApi("rewards");

  const { data: rewards = [], isLoading, isError, refetch } =
    rewardAPI.useGetAll();
  const create = rewardAPI.useCreate();
  const update = rewardAPI.useUpdate();
  const remove = rewardAPI.useDelete();

  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "rewards"
  );

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch
  );

  /** ==========================
   * 3. SEARCH
   * ========================== */
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return rewards.filter(
      (r) =>
        r.reward_name?.toLowerCase().includes(term) ||
        String(r.reward_money ?? "").includes(term)
    );
  }, [rewards, search]);

  /** ==========================
   * 4. UI
   * ========================== */
  if (isLoading)
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi tải dữ liệu thưởng!
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thưởng</h1>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm thưởng
        </button>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm..."
          className="border rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "reward_name", label: "Tên thưởng" },
          {
            field: "reward_money",
            label: "Số tiền (VNĐ)",
            render: (v) => Number(v ?? 0).toLocaleString("vi-VN") + " VNĐ",
          },
        ]}
        data={filtered}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
        ]}
      />

      {/* Form */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa thưởng" : "Thêm thưởng mới"}
          fields={[
            {
              name: "reward_name",
              label: "Tên thưởng",
              type: "text",
              required: true,
            },
            {
              name: "reward_money",
              label: "Số tiền (VNĐ)",
              type: "number",
              required: true,
              min: 0,
            },
          ]}
          initialData={crud.selectedItem}
          onSave={(data) => handleSave(data, "reward_name", "reward_money")}
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
};

export default memo(RewardManagement);
