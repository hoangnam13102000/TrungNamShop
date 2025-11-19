import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const AdminGeneralInformationPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const generalInfoApi = useCRUDApi("general-informations");
  const { data: generalInfos = [], refetch } = generalInfoApi.useGetAll();
  const createMutation = generalInfoApi.useCreate();
  const updateMutation = generalInfoApi.useUpdate();
  const deleteMutation = generalInfoApi.useDelete();

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "general-informations"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.design || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return generalInfos.filter((info) =>
      (info.design || "").toLowerCase().includes(term)
    );
  }, [generalInfos, search]);

  const mappedItems = useMemo(() => {
    return filteredItems.map((info) => ({
      ...info,
      launch_label: info.launch_time
        ? new Date(info.launch_time).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Chưa có",
    }));
  }, [filteredItems]);

  /** ==========================
   * 4. UI
   * ========================== */
  return (
    <AdminLayoutPage
      title="Quản lý thông tin chung"
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "design", label: "Thiết kế" },
        { field: "material", label: "Chất liệu" },
        { field: "dimensions", label: "Kích thước" },
        { field: "weight", label: "Khối lượng" },
        { field: "launch_label", label: "Ngày ra mắt" },
      ]}
      tableData={mappedItems}
      tableActions={[
        { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
      ]}
      formModal={{
        open: crud.openForm,
        title: crud.mode === "edit" ? "Sửa thông tin chung" : "Thêm thông tin chung",
        fields: [
          { name: "design", label: "Thiết kế", type: "text" },
          { name: "material", label: "Chất liệu", type: "text" },
          { name: "dimensions", label: "Kích thước", type: "text" },
          { name: "weight", label: "Khối lượng", type: "text" },
          { name: "launch_time", label: "Ngày ra mắt", type: "date" },
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

export default memo(AdminGeneralInformationPage);
