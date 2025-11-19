import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const PromotionManagementPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const promotionApi = useCRUDApi("promotions");
  const { data: promotions = [], isLoading, refetch } = promotionApi.useGetAll();

  const createMutation = promotionApi.useCreate();
  const updateMutation = promotionApi.useUpdate();
  const deleteMutation = promotionApi.useDelete();

  /** ==========================
   * 2. CRUD HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "promotions"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  /** ==========================
   * 3. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    return promotions.filter((p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [promotions, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** ==========================
   * 4. UI via AdminLayoutPage
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
        title:
          crud.mode === "edit"
            ? `Sửa khuyến mãi - ${crud.selectedItem?.name}`
            : "Thêm khuyến mãi",
        fields: [
          { name: "name", label: "Tên khuyến mãi", type: "text", required: true },
          { name: "description", label: "Mô tả", type: "textarea" },
          { name: "start_date", label: "Ngày bắt đầu", type: "date", required: true },
          { name: "end_date", label: "Ngày kết thúc", type: "date", required: true },
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
      isLoading={isLoading}
    />
  );
};

export default memo(PromotionManagementPage);
