import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

export default memo(function ColorManagement() {
  const colorApi = useCRUDApi("colors");
  const { data: colors = [], refetch } = colorApi.useGetAll();

  const createMutation = colorApi.useCreate();
  const updateMutation = colorApi.useUpdate();
  const deleteMutation = colorApi.useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "colors"
  );

  const {
    dialog,
    closeDialog,
    handleSave: handleSaveAdmin,
    handleDelete: handleDeleteAdmin,
  } = useAdminHandler(crud, refetch);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = useMemo(() => {
    return colors.filter((c) =>
      (c.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [colors, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage]);

  const handleSave = (formData) => handleSaveAdmin(formData, { name: "name" });
  const handleDelete = (item) => handleDeleteAdmin(item, "name");

  return (
    <AdminLayoutPage
      title="Quản lý màu sắc"
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      onAdd={crud.handleAdd}
      tableColumns={[{ field: "name", label: "Tên màu sắc" }]}
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
            ? `Chỉnh sửa màu sắc - ${crud.selectedItem?.name}`
            : "Thêm màu sắc",
        fields: [{ name: "name", label: "Tên màu sắc", type: "text", required: true }],
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
});
