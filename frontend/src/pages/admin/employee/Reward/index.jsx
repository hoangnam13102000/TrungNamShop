import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const RewardManagement = () => {
  /** 1. FETCH DATA & CRUD API */
  const rewardAPI = useCRUDApi("rewards");
  const { data: rewards = [], isLoading, isError, refetch } = rewardAPI.useGetAll();
  const create = rewardAPI.useCreate();
  const update = rewardAPI.useUpdate();
  const remove = rewardAPI.useDelete();

  /** 2. CRUD HOOK */
  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "rewards"
  );

  /** 3. HANDLER */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch);

  /** 4. SEARCH */
  const [search, setSearch] = useState("");

  /** 5. FILTER DATA */
  const filteredRewards = useMemo(() => {
    const term = search.toLowerCase().trim();
    return rewards.filter(
      (r) =>
        r.reward_name?.toLowerCase().includes(term) ||
        String(r.reward_money ?? "").includes(term)
    );
  }, [rewards, search]);

  /** 6. TABLE CONFIG */
  const tableColumns = [
    { field: "reward_name", label: "Tên thưởng" },
    {
      field: "reward_money",
      label: "Số tiền (VNĐ)",
      render: (v) => (v ? Number(v).toLocaleString("vi-VN") + " VNĐ" : "—"),
    },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
  ];

  /** 7. FORM FIELDS */
  const formFields = [
    { name: "reward_name", label: "Tên thưởng", type: "text", required: true },
    { name: "reward_money", label: "Số tiền (VNĐ)", type: "number", required: true, min: 0 },
  ];

  if (isLoading) return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Lỗi tải dữ liệu thưởng!</div>;

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AdminLayoutPage
        title="Quản lý thưởng"
        description="Quản lý các loại thưởng và số tiền"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onAdd={crud.handleAdd}
        tableColumns={tableColumns}
        tableData={filteredRewards}
        tableActions={tableActions}
        // Không có phân trang
      />

      {/* FORM MODAL */}
      {crud.openForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-4 sm:pt-8 md:pt-10 z-50 overflow-y-auto p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl sm:max-w-3xl my-4">
            <DynamicForm
              title={crud.mode === "edit" ? "Sửa thưởng" : "Thêm thưởng mới"}
              fields={formFields}
              initialData={crud.selectedItem || {}}
              onSave={handleSave}
              onClose={crud.handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* DIALOG */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        closeText={dialog.closeText}
        customButtons={dialog.customButtons}
      />
    </div>
  );
};

export default memo(RewardManagement);
