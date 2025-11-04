import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const AdminFrontCameraPage = () => {
  /** ===========================
   *   CRUD API setup
   *  =========================== */
  const { useGetAll, useCreate, useUpdate, useDelete } = useCRUDApi("front-cameras");
  const { data: frontCameras = [], isLoading, refetch } = useGetAll();

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  /** ===========================
   *  CRUD logic
   *  =========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: (id) => deleteMutation.mutateAsync({ id }),
    },
    "front-cameras"
  );

  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.resolution || "Không rõ"
  );

  /** ===========================
   *   Search logic
   *  =========================== */
  const [search, setSearch] = useState("");
  const filteredItems = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return frontCameras.filter((c) => c.resolution?.toLowerCase().includes(lowerSearch));
  }, [frontCameras, search]);

  /** ===========================
   *   Render UI
   *  =========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-semibold">Quản lý camera trước</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm theo độ phân giải..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-72"
          />

          <button
            onClick={crud.handleAdd}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus /> Thêm camera
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <AdminListTable
          columns={[
            { field: "resolution", label: "Độ phân giải" },
            { field: "aperture", label: "Khẩu độ" },
            { field: "video_capability", label: "Video" },
            { field: "features", label: "Tính năng" },
          ]}
          data={filteredItems}
          actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
            { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
          ]}
        />
      )}

      {/* Form thêm/sửa */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa camera trước" : "Thêm camera trước"}
          fields={[
            { name: "resolution", label: "Độ phân giải (MP)", type: "text", required: true },
            { name: "aperture", label: "Khẩu độ (f/)", type: "text" },
            { name: "video_capability", label: "Video (độ phân giải)", type: "text" },
            { name: "features", label: "Tính năng", type: "textarea" },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          className="w-full max-w-lg mx-auto"
        />
      )}

      {/* Dialog  */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
};

export default memo(AdminFrontCameraPage);
