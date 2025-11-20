import { memo, useState, useMemo, useCallback } from "react";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const PromotionManagementPage = () => {
  /** ==========================
   * 1. API & CRUD
   * ========================== */
  const promotionApi = useCRUDApi("promotions");
  const { data: promotions = [], isLoading, refetch } = promotionApi.useGetAll();

  const createMutation = promotionApi.useCreate();
  const updateMutation = promotionApi.useUpdate();
  const deleteMutation = promotionApi.useDelete();

  /** ==========================
   * 2. CRUD HANDLER
   * ========================== */
  const normalizeDiscount = useCallback(
    (data) => ({
      ...data,
      discount_percent: Math.round(Number(data.discount_percent || 0)),
      status: data.status || "inactive",
    }),
    []
  );

  const crud = useAdminCrud(
    {
      create: async (data) => await createMutation.mutateAsync(normalizeDiscount(data)),
      update: async (id, data) =>
        await updateMutation.mutateAsync({ id, data: normalizeDiscount(data) }),
      delete: async (id) => await deleteMutation.mutateAsync(id),
    },
    "promotions"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(
    () =>
      promotions.filter((p) => (p.name || "").toLowerCase().includes(search.toLowerCase().trim())),
    [promotions, search]
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** ==========================
   * 4. UI - Status Label
   * ========================== */
  const renderStatusLabel = (status) => {
    const isActive = status === "active";
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
            <span>Không hoạt động</span>
          </>
        )}
      </div>
    );
  };

  return (
    <AdminLayoutPage
      title="Quản lý khuyến mãi"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "name", label: "Tên khuyến mãi" },
        { field: "discount_percent", label: "Giảm (%)", render: (val) => `${val || 0}%` },
        { field: "start_date", label: "Ngày bắt đầu" },
        { field: "end_date", label: "Ngày kết thúc" },
        { field: "status", label: "Trạng thái", render: (val) => renderStatusLabel(val) },
        { field: "description", label: "Mô tả" },
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
        title:
          crud.mode === "edit"
            ? `Sửa khuyến mãi - ${crud.selectedItem?.name}`
            : "Thêm khuyến mãi",
        fields: [
          { name: "name", label: "Tên khuyến mãi", type: "text", required: true },
          { name: "discount_percent", label: "Giảm (%)", type: "number", required: true, min: 0, max: 100 },
          {
            name: "status",
            label: "Trạng thái",
            type: "select",
            required: true,
            options: [
              { label: "Hoạt động", value: "active" },
              { label: "Không hoạt động", value: "inactive" },
            ],
          },
          { name: "description", label: "Mô tả", type: "textarea" },
          { name: "start_date", label: "Ngày bắt đầu", type: "date", required: true },
          { name: "end_date", label: "Ngày kết thúc", type: "date", required: true },
        ],
        initialData: crud.selectedItem
          ? { ...crud.selectedItem, discount_percent: Math.round(Number(crud.selectedItem.discount_percent || 0)) }
          : {},
      }}
      onFormSave={handleSave}
      onFormClose={crud.handleCloseForm}
      dialogProps={{ open: dialog.open, mode: dialog.mode, title: dialog.title, message: dialog.message, onConfirm: dialog.onConfirm, onClose: closeDialog }}
      isLoading={isLoading}
    />
  );
};

export default memo(PromotionManagementPage);