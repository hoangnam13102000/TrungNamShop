import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import {
  useBatteriesCharging,
  useCreateBatteryCharging,
  useUpdateBatteryCharging,
  useDeleteBatteryCharging,
} from "../../../../api/product/batteryCharging";

export default memo(function AdminBatteryPage() {
  /** ==========================
   *  1. FETCH DATA
   * ========================== */
  const { data: batteries = [], isLoading, refetch } = useBatteriesCharging();

  /** ==========================
   *  2. CRUD MUTATIONS
   * ========================== */
  const createMutation = useCreateBatteryCharging();
  const updateMutation = useUpdateBatteryCharging();
  const deleteMutation = useDeleteBatteryCharging();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "batteries_charging"
  );

  /** ==========================
   *  3. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => {
      const capacity = item?.battery_capacity || "Không rõ";
      const port = item?.charging_port || "Không rõ";
      return `${capacity} (${port})`;
    }
  );

  /** ==========================
   *  4. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return batteries.filter(
      (b) =>
        b.battery_capacity?.toLowerCase().includes(search.toLowerCase()) ||
        b.charging?.toLowerCase().includes(search.toLowerCase())
    );
  }, [batteries, search]);

  /** ==========================
   *  5. UI
   * ========================== */
  return (
    <>
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Quản lý pin</h1>

        {/* BUTTON + SEARCH */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <button
            onClick={crud.handleAdd}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
          >
            <FaPlus /> Thêm pin
          </button>

          <input
            type="text"
            placeholder="Tìm kiếm pin..."
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
                { field: "battery_capacity", label: "Dung lượng pin" },
                { field: "charging_port", label: "Cổng sạc" },
                { field: "charging", label: "Công nghệ sạc" }, 
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
            title={crud.mode === "edit" ? "Sửa pin" : "Thêm pin"}
            fields={[
              {
                name: "battery_capacity",
                label: "Dung lượng pin",
                type: "text",
                required: true,
              },
              { name: "charging_port", label: "Cổng sạc", type: "text" },
              { name: "charging", label: "Công nghệ sạc", type: "text" }, // Note: text input
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
