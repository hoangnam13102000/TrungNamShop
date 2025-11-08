import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

export default memo(function AdminGeneralInformationPage() {
  /** ==========================
   *  1. FETCH + CRUD API
   * ========================== */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("general-informations");

  const { data: generalInfos = [], isLoading, refetch } = useGetAll();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "general-informations"
  );

  /** ==========================
   *  2. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.design || "Không rõ"
  );

  /** ==========================
   *  3. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return generalInfos.filter((info) =>
      (info.design || "").toLowerCase().includes(search.toLowerCase())
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
   *  4. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý thông tin chung</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm thông tin
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo thiết kế..."
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
              { field: "design", label: "Thiết kế" },
              { field: "material", label: "Chất liệu" },
              { field: "dimensions", label: "Kích thước" },
              { field: "weight", label: "Khối lượng" },
              { field: "launch_label", label: "Ngày ra mắt" },
            ]}
            data={mappedItems}
            actions={[
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
            ]}
          />
        </div>
      )}

      {/* FORM */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit" ? "Sửa thông tin chung" : "Thêm thông tin chung"
          }
          fields={[
            { name: "design", label: "Thiết kế", type: "text" },
            { name: "material", label: "Chất liệu", type: "text" },
            { name: "dimensions", label: "Kích thước", type: "text" },
            { name: "weight", label: "Khối lượng", type: "text" },
            { name: "launch_time", label: "Ngày ra mắt", type: "date" },
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
