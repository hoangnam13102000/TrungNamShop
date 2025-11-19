import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const AdminOperatingSystemPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const osApi = useCRUDApi("operating-systems");
  const { data: operatingSystems = [], refetch } = osApi.useGetAll();
  const createMutation = osApi.useCreate();
  const updateMutation = osApi.useUpdate();
  const deleteMutation = osApi.useDelete();

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: async (data) => {
        await createMutation.mutateAsync(data);
        await refetch();
      },
      update: async (id, data) => {
        await updateMutation.mutateAsync({ id, data });
        await refetch();
      },
      delete: async (id) => {
        await deleteMutation.mutateAsync({ id });
        await refetch();
      },
    },
    "operating-systems"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return operatingSystems.filter((os) =>
      os.name?.toLowerCase().includes(term)
    );
  }, [operatingSystems, search]);

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
      title="Quản lý Hệ điều hành"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "name", label: "Hệ điều hành" },
        { field: "processor", label: "Bộ xử lý" },
        { field: "cpu_speed", label: "Tốc độ CPU" },
        { field: "gpu", label: "GPU" },
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
        title: crud.mode === "edit" ? "Sửa Hệ điều hành" : "Thêm Hệ điều hành",
        fields: [
          { name: "name", label: "Hệ điều hành", type: "text", required: true },
          { name: "processor", label: "Bộ xử lý", type: "text" },
          { name: "cpu_speed", label: "Tốc độ CPU", type: "text" },
          { name: "gpu", label: "GPU", type: "text" },
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

export default memo(AdminOperatingSystemPage);
