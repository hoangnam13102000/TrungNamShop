import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import Pagination from "../../../../components/common/Pagination";

import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const AllowanceManagement = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const allowanceAPI = useCRUDApi("allowances");
  const { data: allowances = [], isLoading, isError, refetch } =
    allowanceAPI.useGetAll();
  const create = allowanceAPI.useCreate();
  const update = allowanceAPI.useUpdate();
  const remove = allowanceAPI.useDelete();

  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "allowances"
  );

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch
  );

  /** ==========================
   * 3. SEARCH & PAGINATION STATE
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /** ==========================
   * 4. FILTER DATA
   * ========================== */
  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return allowances.filter(
      (a) =>
        a.allowance_name?.toLowerCase().includes(term) ||
        String(a.allowance_amount ?? "").includes(term)
    );
  }, [allowances, search]);

  /** ==========================
   * 5. PAGINATION
   * ========================== */
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  /** ==========================
   * 6. UI
   * ========================== */
  if (isLoading)
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi tải dữ liệu phụ cấp!
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý phụ cấp</h1>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm phụ cấp
        </button>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset trang khi search
          }}
          placeholder="Tìm kiếm phụ cấp..."
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* Table */}
      <AdminListTable
        columns={[
          { field: "allowance_name", label: "Tên phụ cấp" },
          {
            field: "allowance_amount",
            label: "Số tiền (VNĐ)",
            render: (v) => Number(v ?? 0).toLocaleString("vi-VN") + " VNĐ",
          },
        ]}
        data={currentItems} // hiển thị dữ liệu trang hiện tại
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
          title={
            crud.mode === "edit" ? "Sửa phụ cấp" : "Thêm phụ cấp mới"
          }
          fields={[
            {
              name: "allowance_name",
              label: "Tên phụ cấp",
              type: "text",
              required: true,
            },
            {
              name: "allowance_amount",
              label: "Số tiền (VNĐ)",
              type: "number",
              required: true,
              min: 0,
              step: 0.01,
            },
          ]}
          initialData={crud.selectedItem}
          onSave={(data) =>
            handleSave(data, "allowance_name", "allowance_amount")
          }
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

export default memo(AllowanceManagement);
