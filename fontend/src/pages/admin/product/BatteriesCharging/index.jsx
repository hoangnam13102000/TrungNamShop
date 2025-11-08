import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import Pagination from "../../../../components/common/Pagination"; 

export default memo(function AdminBatteryPage() {
  /** ==========================
   * 1. CRUD HOOKS TỪ useCRUDApi
   * ========================== */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("batteries-charging");

  /** ==========================
   * 2. FETCH DATA
   * ========================== */
  const { data: batteries = [], isLoading, refetch } = useGetAll();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  /** ==========================
   * 3. CRUD LOGIC
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "batteries_charging"
  );

  /** ==========================
   * 4. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => `${item?.battery_capacity || "Không rõ"} (${item?.charging_port || "Không rõ"})`
  );

  /** ==========================
   * 5. SEARCH + PAGINATION STATE
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /** ==========================
   * 6. FILTER DATA
   * ========================== */
  const filteredItems = useMemo(() => {
    return batteries.filter(
      (b) =>
        b.battery_capacity?.toLowerCase().includes(search.toLowerCase()) ||
        b.charging?.toLowerCase().includes(search.toLowerCase())
    );
  }, [batteries, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  /** ==========================
   * 7. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý pin</h1>

      {/* Toolbar */}
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
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page khi search
          }}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <AdminListTable
              columns={[
                { field: "battery_capacity", label: "Dung lượng pin" },
                { field: "charging_port", label: "Cổng sạc" },
                { field: "charging", label: "Công nghệ sạc" },
              ]}
              data={currentItems} // dữ liệu trang hiện tại
              actions={[
                { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
                { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
              ]}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              maxVisible={5}
            />
          )}
        </>
      )}

      {/* Form */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa pin" : "Thêm pin"}
          fields={[
            { name: "battery_capacity", label: "Dung lượng pin", type: "text", required: true },
            { name: "charging_port", label: "Cổng sạc", type: "text" },
            { name: "charging", label: "Công nghệ sạc", type: "text" },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          className="w-full max-w-lg mx-auto"
        />
      )}

      {/* Dialog */}
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
