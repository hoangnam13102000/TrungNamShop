import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const AdminMemoryPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const memoryApi = useCRUDApi("memories");
  const { data: memories = [], isLoading, refetch } = memoryApi.useGetAll();
  const createMutation = memoryApi.useCreate();
  const updateMutation = memoryApi.useUpdate();
  const deleteMutation = memoryApi.useDelete();

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "memories"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.ram || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return memories.filter((m) =>
      (m.ram || "").toLowerCase().includes(term)
    );
  }, [memories, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** ==========================
   * Loading UI
   * ========================== */
  if (isLoading) {
    return <div className="p-4 text-gray-500">Đang tải dữ liệu...</div>;
  }

  /** ==========================
   * 4. UI
   * ========================== */
  return (
    <AdminLayoutPage
      title="Quản lý bộ nhớ"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "ram", label: "Dung lượng RAM" },
        { field: "internal_storage", label: "Bộ nhớ trong" },
        { field: "memory_card_slot", label: "Khe cắm thẻ nhớ" },
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
        title: crud.mode === "edit" ? "Sửa bộ nhớ" : "Thêm bộ nhớ",
        fields: [
          { name: "ram", label: "Dung lượng RAM", type: "text", required: true },
          { name: "internal_storage", label: "Bộ nhớ trong", type: "text", required: true },
          { name: "memory_card_slot", label: "Khe cắm thẻ nhớ", type: "text" },
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

export default memo(AdminMemoryPage);
