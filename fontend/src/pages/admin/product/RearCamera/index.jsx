import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi"; 

export default memo(function AdminRearCameraPage() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const rearCameraApi = useCRUDApi("rear-cameras"); 
  const { data: rearCameras = [], isLoading, refetch } = rearCameraApi.useGetAll();

  const createMutation = rearCameraApi.useCreate();
  const updateMutation = rearCameraApi.useUpdate();
  const deleteMutation = rearCameraApi.useDelete();

  /** ==========================
   * 2. CRUD SETUP
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "rear-cameras"
  );

  /** ==========================
   * 3. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.resolution || "Không rõ"
  );

  /** ==========================
   * 4. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return rearCameras.filter((c) =>
      c.resolution?.toLowerCase().includes(search.toLowerCase())
    );
  }, [rearCameras, search]);

  /** ==========================
   * 5. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý Camera sau</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm camera sau
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo độ phân giải..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
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
        </div>
      )}

      {/* FORM ADD / EDIT */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa camera sau" : "Thêm camera sau"}
          fields={[
            {
              name: "resolution",
              label: "Độ phân giải (MP)",
              type: "text",
              required: true,
            },
            { name: "aperture", label: "Khẩu độ (f/)", type: "text" },
            {
              name: "video_capability",
              label: "Video (độ phân giải)",
              type: "text",
            },
            { name: "features", label: "Tính năng", type: "textarea" },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          className="w-full max-w-lg mx-auto"
        />
      )}

      {/* DIALOG */}
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
});
