import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import placeholder from "../../../../assets/admin/logoicon1.jpg";

export default memo(function BrandManagement() {
  const brandAPI = useCRUDApi("brands");

  /** ==========================
   * 1. FETCH DATA + isLoading
   * ========================== */
  const { data: brands = [], isLoading, refetch } = brandAPI.useGetAll();

  const createMutation = brandAPI.useCreate();
  const updateMutation = brandAPI.useUpdate();
  const deleteMutation = brandAPI.useDelete();

  /** ==========================
   * 2. HANDLER CRUD
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "brands"
  );

  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH + PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(
    () =>
      brands.filter((b) =>
        (b.name || "").toLowerCase().includes(search.toLowerCase().trim())
      ),
    [brands, search]
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
      title="Quản lý thương hiệu"
      isLoading={isLoading}
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "name", label: "Tên thương hiệu" },
        {
          field: "image",
          label: "Hình ảnh",
          render: (value) => (
            <img
              src={value || placeholder}
              alt="brand"
              className="w-16 h-16 object-contain rounded"
              onError={(e) => (e.target.src = placeholder)}
            />
          ),
        },
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
            ? `Chỉnh sửa thương hiệu - ${crud.selectedItem?.name}`
            : "Thêm thương hiệu",
        fields: [
          { name: "name", label: "Tên thương hiệu", type: "text", required: true },
          {
            name: "image",
            label: "Hình ảnh đại diện",
            type: "file",
            required: crud.mode === "create",
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
});
