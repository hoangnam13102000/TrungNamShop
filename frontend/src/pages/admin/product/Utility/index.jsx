import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const AdminUtilityManagementPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD
   * ========================== */
  const utilityApi = useCRUDApi("utilities");
  const { data: utilities = [], isLoading, refetch } = utilityApi.useGetAll();

  const createMutation = utilityApi.useCreate();
  const updateMutation = utilityApi.useUpdate();
  const deleteMutation = utilityApi.useDelete();

  /** ==========================
   * 2. CRUD HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "utilities"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.special_features || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    return utilities.filter((u) =>
      (u.special_features || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );
  }, [utilities, search]);

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
      title="Quản lý tiện ích"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "advanced_security", label: "Bảo mật nâng cao" },
        { field: "special_features", label: "Tính năng đặc biệt" },
        { field: "water_dust_resistance", label: "Kháng nước bụi" },
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
        title: crud.mode === "edit" ? `Sửa tiện ích - ${crud.selectedItem?.special_features}` : "Thêm tiện ích",
        fields: [
          { name: "advanced_security", label: "Bảo mật nâng cao", type: "text" },
          { name: "special_features", label: "Tính năng đặc biệt", type: "text" },
          { name: "water_dust_resistance", label: "Kháng nước bụi", type: "text" },
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

export default memo(AdminUtilityManagementPage);
