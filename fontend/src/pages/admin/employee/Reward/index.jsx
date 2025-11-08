import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import Pagination from "../../../../components/common/Pagination";

import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const RewardManagement = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const rewardAPI = useCRUDApi("rewards");
  const { data: rewards = [], isLoading, isError, refetch } = rewardAPI.useGetAll();

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
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch);

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return rewards.filter(
      (r) =>
        r.reward_name?.toLowerCase().includes(term) ||
        String(r.reward_money ?? "").includes(term)
    );
  }, [rewards, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

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
          type="text"
          placeholder="Tìm kiếm theo tên hoặc số tiền..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "reward_name", label: "Tên thưởng" },
          {
            field: "reward_money",
            label: "Số tiền (VNĐ)",
            render: (v) =>
              v ? Number(v).toLocaleString("vi-VN") + " VNĐ" : "—",
          },
        ]}
        data={currentItems}
        actions={[
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
          { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
        ]}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxVisible={5}
        />
      )}

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
          onSave={handleSave}
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
