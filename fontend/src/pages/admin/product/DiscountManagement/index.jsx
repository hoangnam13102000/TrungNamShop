import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const DiscountManagement = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const discountApi = useCRUDApi("discounts");
  const { data: discounts = [], isLoading, isError, refetch } = discountApi.useGetAll();
  const createMutation = discountApi.useCreate();
  const updateMutation = discountApi.useUpdate();
  const deleteMutation = discountApi.useDelete();

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "discounts"
  );

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
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

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
    <AdminLayoutPage
      title="Quản lý giảm giá"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "code", label: "Mã giảm giá" },
        { field: "percentage", label: "Phần trăm (%)", render: (v) => (v !== null ? v + " %" : "—") },
        { field: "start_date", label: "Ngày bắt đầu", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
        { field: "end_date", label: "Ngày kết thúc", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
        {
          field: "status",
          label: "Trạng thái",
          render: (val) => (
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                val === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
              }`}
            >
              {val === "active" ? "Hoạt động" : "Ngừng hoạt động"}
            </span>
          ),
        },
      ]}
      tableData={paginatedItems}
      tableActions={[
        { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
      ]}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      formModal={{
        open: crud.openForm,
        title: crud.mode === "edit" ? "Sửa giảm giá" : "Thêm giảm giá mới",
        fields: [
          { name: "code", label: "Mã giảm giá", type: "text", required: true },
          { name: "percentage", label: "Phần trăm (%)", type: "number", min: 0, max: 100 },
          { name: "start_date", label: "Ngày bắt đầu", type: "date" },
          { name: "end_date", label: "Ngày kết thúc", type: "date" },
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
        ],
        initialData: crud.selectedItem,
      }}
      onFormSave={handleSave}
      onFormClose={crud.handleCloseForm}
      dialogProps={{
        open: dialog.open,
        mode: dialog.mode,
        title: dialog.title,
        message: dialog.message,
        onConfirm: dialog.onConfirm,
        onClose: closeDialog,
      }}
    />
  );
};

export default memo(DiscountManagement);
