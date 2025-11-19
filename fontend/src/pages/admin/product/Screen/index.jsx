import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const AdminScreenPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD
   * ========================== */
  const screenApi = useCRUDApi("screens");
  const { data: screens = [], isLoading, refetch } = screenApi.useGetAll();

  const createMutation = screenApi.useCreate();
  const updateMutation = screenApi.useUpdate();
  const deleteMutation = screenApi.useDelete();

  /** ==========================
   * 2. CRUD HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "screens"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.display_technology || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    return screens.filter((s) =>
      (s.display_technology || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [screens, search]);

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
      title="Quản lý màn hình"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "display_technology", label: "Công nghệ hiển thị" },
        { field: "resolution", label: "Độ phân giải" },
        { field: "screen_size", label: "Kích thước (inch)" },
        { field: "max_brightness", label: "Độ sáng (nits)" },
        { field: "glass_protection", label: "Bảo vệ kính" },
      ]}
      tableData={paginatedItems}
      tableActions={[
        { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
      ]}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      formModal={{
        open: crud.openForm,
        title:
          crud.mode === "edit"
            ? `Sửa màn hình - ${crud.selectedItem?.display_technology}`
            : "Thêm màn hình",
        fields: [
          { name: "display_technology", label: "Công nghệ hiển thị", type: "text", required: true },
          { name: "resolution", label: "Độ phân giải (VD: 2400x1080)", type: "text" },
          { name: "screen_size", label: "Kích thước (inch)", type: "number", step: "0.01" },
          { name: "max_brightness", label: "Độ sáng tối đa (nits)", type: "number" },
          { name: "glass_protection", label: "Bảo vệ kính (VD: Gorilla Glass 5)", type: "text" },
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

export default memo(AdminScreenPage);
