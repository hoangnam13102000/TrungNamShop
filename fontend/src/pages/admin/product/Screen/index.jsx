import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

import {
  useScreens,
  useCreateScreen,
  useUpdateScreen,
  useDeleteScreen,
} from "../../../../api/product/screen";

export default memo(function AdminScreenPage() {
  /** ==========================
   *  1. FETCH DATA
   * ========================== */
  const { data: screens = [], isLoading, refetch } = useScreens();

  /** ==========================
   *  2. CRUD MUTATIONS
   * ========================== */
  const createMutation = useCreateScreen();
  const updateMutation = useUpdateScreen();
  const deleteMutation = useDeleteScreen();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "screens"
  );

  /** ==========================
   *  3. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.display_technology || "Không rõ"
  );

  /** ==========================
   *  4. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return screens.filter((s) =>
      s.display_technology?.toLowerCase().includes(search.toLowerCase())
    );
  }, [screens, search]);

  /** ==========================
   *  5. UI
   * ========================== */
  return (
    <>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Quản lý màn hình</h1>

        {/* BUTTON + SEARCH */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <button
            onClick={crud.handleAdd}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
          >
            <FaPlus /> Thêm màn hình
          </button>

          <input
            type="text"
            placeholder="Tìm kiếm theo công nghệ hiển thị..."
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
                { field: "display_technology", label: "Công nghệ hiển thị" },
                { field: "resolution", label: "Độ phân giải" },
                { field: "screen_size", label: "Kích thước" },
                { field: "max_brightness", label: "Độ sáng tối đa" },
                { field: "glass_protection", label: "Kính bảo vệ" },
              ]}
              data={filteredItems}
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
            title={crud.mode === "edit" ? "Sửa màn hình" : "Thêm màn hình"}
            fields={[
              {
                name: "display_technology",
                label: "Công nghệ hiển thị",
                type: "text",
                required: true,
              },
              { name: "resolution", label: "Độ phân giải", type: "text" },
              { name: "screen_size", label: "Kích thước", type: "text" },
              { name: "max_brightness", label: "Độ sáng tối đa", type: "text" },
              { name: "glass_protection", label: "Kính bảo vệ", type: "text" },
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
    </>
  );
});
