import { memo, useState, useMemo, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
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
    (data) => ({ ...data, discount_percent: Math.round(Number(data.discount_percent || 0)) }),
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

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch, (item) => item?.name || "Không tên");

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
   * 4. UI
   * ========================== */
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
        title: crud.mode === "edit" ? `Sửa khuyến mãi - ${crud.selectedItem?.name}` : "Thêm khuyến mãi",
        fields: [
          { name: "name", label: "Tên khuyến mãi", type: "text", required: true },
          { name: "discount_percent", label: "Giảm (%)", type: "number", required: true, min: 0, max: 100 },
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
