import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi"; 

export default memo(function PromotionManagement() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const promotionApi = useCRUDApi("promotions"); // 

  const { data: promotions = [], isLoading, refetch } = promotionApi.useGetAll();

  const createMutation = promotionApi.useCreate();
  const updateMutation = promotionApi.useUpdate();
  const deleteMutation = promotionApi.useDelete();

  /** ==========================
   * 2. CRUD SETUP
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "promotions"
  );

  /** ==========================
   * 3. HANDLER + DIALOG
   * ========================== */
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  /** ==========================
   * 4. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return promotions.filter((p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [promotions, search]);

  /** ==========================
   * 5. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý khuyến mãi</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm khuyến mãi
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
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
              { field: "name", label: "Tên khuyến mãi" },
              { field: "start_date", label: "Ngày bắt đầu" },
              { field: "end_date", label: "Ngày kết thúc" },
              { field: "description", label: "Mô tả" },
            ]}
            data={filteredItems}
            actions={[
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
            ]}
          />
        </div>
      )}

      {/* FORM ADD / EDIT */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Sửa khuyến mãi - ${crud.selectedItem?.name}`
              : "Thêm khuyến mãi"
          }
          fields={[
            {
              name: "name",
              label: "Tên khuyến mãi",
              type: "text",
              required: true,
            },
            { name: "description", label: "Mô tả", type: "textarea" },
            {
              name: "start_date",
              label: "Ngày bắt đầu",
              type: "date",
              required: true,
            },
            {
              name: "end_date",
              label: "Ngày kết thúc",
              type: "date",
              required: true,
            },
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
