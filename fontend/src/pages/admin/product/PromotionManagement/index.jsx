import { memo, useState, useMemo, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1"; // hoặc useAdminCrud
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
} from "../../../../api/product/promotion/";

export default memo(function PromotionManagement() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const { data: promotions = [], isLoading } = usePromotions();
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "promotions"
  );

  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
  });

  const showDialog = useCallback((mode, title, message, onConfirm = null) => {
    setDialog({ open: true, mode, title, message, onConfirm });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  /** ==========================
   * 2. FILTERED DATA
   * ========================== */
  const filteredItems = useMemo(() => {
    return promotions.filter((p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [promotions, search]);

  /** ==========================
   * 3. HANDLERS
   * ========================== */
  const handleSave = async (formData) => {
    showDialog(
      "confirm",
      "Xác nhận lưu",
      "Bạn có chắc muốn lưu khuyến mãi này?",
      async () => {
        try {
          await crud.handleSave(formData);
          showDialog("success", "Thành công", "Khuyến mãi đã được lưu!");
        } catch (err) {
          console.error("Save error:", err);
          showDialog("error", "Lỗi", "Không thể lưu khuyến mãi!");
        }
      }
    );
  };

  const handleDelete = (item) => {
    showDialog(
      "confirm",
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa "${item.name}" không?`,
      async () => {
        try {
          await crud.handleDelete(item.id);
          showDialog("success", "Thành công", "Đã xóa khuyến mãi!");
        } catch (err) {
          console.error("Delete error:", err);
          showDialog("error", "Lỗi", "Không thể xóa khuyến mãi!");
        }
      }
    );
  };

  /** ==========================
   * 4. UI
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
            { name: "name", label: "Tên khuyến mãi", type: "text", required: true },
            { name: "description", label: "Mô tả", type: "textarea" },
            { name: "start_date", label: "Ngày bắt đầu", type: "date", required: true },
            { name: "end_date", label: "Ngày kết thúc", type: "date", required: true },
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
