import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import Pagination from "../../../../components/common/Pagination";

import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const DiscountManagement = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const discountAPI = useCRUDApi("discounts");
  const { data: discounts = [], isLoading, isError, refetch } = discountAPI.useGetAll();

  const create = discountAPI.useCreate();
  const update = discountAPI.useUpdate();
  const remove = discountAPI.useDelete();

  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "discounts"
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
    return discounts.filter(
      (d) =>
        d.code?.toLowerCase().includes(term) ||
        String(d.percentage ?? "").includes(term) ||
        d.status?.toLowerCase().includes(term) ||
        (d.start_date || "").toLowerCase().includes(term) ||
        (d.end_date || "").toLowerCase().includes(term)
    );
  }, [discounts, search]);

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
        Lỗi tải dữ liệu giảm giá!
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý giảm giá</h1>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm giảm giá
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo mã, %, trạng thái hoặc ngày..."
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
          { field: "code", label: "Mã giảm giá" },
          {
            field: "percentage",
            label: "Phần trăm (%)",
            render: (v) => (v !== null ? v + " %" : "—"),
          },
          {
            field: "start_date",
            label: "Ngày bắt đầu",
            render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
          },
          {
            field: "end_date",
            label: "Ngày kết thúc",
            render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
          },
          {
            field: "status",
            label: "Trạng thái",
            render: (val) => (
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  val === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {val === "active" ? "Hoạt động" : "Ngừng hoạt động"}
              </span>
            ),
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
          title={crud.mode === "edit" ? "Sửa giảm giá" : "Thêm giảm giá mới"}
          fields={[
            {
              name: "code",
              label: "Mã giảm giá",
              type: "text",
              required: true,
            },
            {
              name: "percentage",
              label: "Phần trăm (%)",
              type: "number",
              min: 0,
              max: 100,
              required: false,
            },
            {
              name: "start_date",
              label: "Ngày bắt đầu",
              type: "date",
              required: false,
            },
            {
              name: "end_date",
              label: "Ngày kết thúc",
              type: "date",
              required: false,
            },
            {
              name: "status",
              label: "Trạng thái",
              type: "select",
              options: [
                { label: "Hoạt động", value: "active" },
                { label: "Ngừng hoạt động", value: "inactive" },
              ],
              required: true,
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

export default memo(DiscountManagement);
