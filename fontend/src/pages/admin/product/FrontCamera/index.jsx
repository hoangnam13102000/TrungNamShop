import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const AdminFrontCameraPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const frontCameraApi = useCRUDApi("front-cameras");
  const { data: frontCameras = [],  refetch } = frontCameraApi.useGetAll();
  const createMutation = frontCameraApi.useCreate();
  const updateMutation = frontCameraApi.useUpdate();
  const deleteMutation = frontCameraApi.useDelete();

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "front-cameras"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.resolution || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return frontCameras.filter((c) =>
      (c.resolution || "").toLowerCase().includes(term)
    );
  }, [frontCameras, search]);

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
      title="Quản lý camera trước"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "resolution", label: "Độ phân giải" },
        { field: "aperture", label: "Khẩu độ" },
        { field: "video_capability", label: "Video" },
        { field: "features", label: "Tính năng" },
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
        title: crud.mode === "edit" ? "Sửa camera trước" : "Thêm camera trước",
        fields: [
          { name: "resolution", label: "Độ phân giải (MP)", type: "text", required: true },
          { name: "aperture", label: "Khẩu độ (f/)", type: "text" },
          { name: "video_capability", label: "Video (độ phân giải)", type: "text" },
          { name: "features", label: "Tính năng", type: "textarea" },
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

export default memo(AdminFrontCameraPage);
