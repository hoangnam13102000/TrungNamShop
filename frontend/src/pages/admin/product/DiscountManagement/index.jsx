import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
   * 4. UI - Status Label
   * ========================== */
  const renderStatusLabel = (val) => {
    const isActive = val === "active";
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "600",
          color: isActive ? "#047857" : "#6b7280",
          backgroundColor: isActive ? "#d1fae5" : "#f3f4f6",
          border: `1.5px solid ${isActive ? "#6ee7b7" : "#d1d5db"}`,
          transition: "all 0.2s ease",
        }}
      >
        {isActive ? (
          <>
            <FaCheckCircle style={{ fontSize: "12px", color: "#10b981" }} />
            <span>Hoạt động</span>
          </>
        ) : (
          <>
            <FaTimesCircle style={{ fontSize: "12px", color: "#9ca3af" }} />
            <span>Ngừng hoạt động</span>
          </>
        )}
      </div>
    );
  };

  /** ==========================
   * 5. Loading & Error States
   * ========================== */
  if (isLoading)
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi tải dữ liệu giảm giá!
      </div>
    );

  /** ==========================
   * 6. UI via AdminLayoutPage
   * ========================== */
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
          render: (val) => renderStatusLabel(val),
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