import { memo, useState, useMemo, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import {
  useMemberLevelings,
  useCreateMemberLeveling,
  useUpdateMemberLeveling,
  useDeleteMemberLeveling,
} from "../../../../api/account/memberLeveling/";

const MemberLevelingList = () => {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const { data: levels = [], isLoading } = useMemberLevelings();
  const createMutation = useCreateMemberLeveling();
  const updateMutation = useUpdateMemberLeveling();
  const deleteMutation = useDeleteMemberLeveling();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "member-levelings"
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
   * 2. FILTER DATA & FORMAT
   * ========================== */
  const filteredItems = useMemo(() => {
    return levels
      .filter((l) =>
        (l.name || "").toLowerCase().includes(search.toLowerCase().trim())
      )
      .map((l) => ({
        ...l,
        limit: l.limit != null ? Math.floor(Number(l.limit)) : null, // ép limit thành số nguyên
      }));
  }, [levels, search]);

  /** ==========================
   * 3. HANDLERS
   * ========================== */
  const handleSave = async (formData) => {
    if (crud.selectedItem?.id === 1) {
      showDialog("alert", "Cảnh báo", "Không thể sửa bậc đặc biệt!");
      return;
    }

    // Ép limit thành số nguyên trước save
    if (formData.limit != null) {
      formData.limit = Math.floor(Number(formData.limit));
    }

    showDialog(
      "confirm",
      "Xác nhận",
      `Bạn có chắc muốn ${crud.mode === "edit" ? "cập nhật" : "thêm"} bậc thành viên "${formData.name}"?`,
      async () => {
        try {
          await crud.handleSave(formData);
          showDialog("success", "Thành công", "Đã lưu bậc thành viên!");
        } catch (err) {
          console.error("Save error:", err);
          showDialog("error", "Lỗi", "Không thể lưu bậc thành viên!");
        }
      }
    );
  };

  const handleDelete = (item) => {
    if (item.id === 1) {
      showDialog("alert", "Cảnh báo", "Không thể xóa bậc đặc biệt!");
      return;
    }

    showDialog(
      "confirm",
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa bậc thành viên "${item.name}"?`,
      async () => {
        try {
          await crud.handleDelete(item.id);
          showDialog("success", "Thành công", "Đã xóa bậc thành viên!");
        } catch (err) {
          console.error("Delete error:", err);
          showDialog("error", "Lỗi", "Không thể xóa bậc thành viên!");
        }
      }
    );
  };

  /** ==========================
   * 4. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý bậc thành viên</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm bậc thành viên
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm bậc thành viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <AdminListTable
          columns={[
            { field: "name", label: "Tên bậc thành viên" },
            { field: "limit", label: "Hạn mức (point)" },
          ]}
          data={filteredItems}
          actions={[
            { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit, disabled: (row) => row.id === 1 },
            { icon: <FaTrash />, label: "Xóa", onClick: handleDelete, disabled: (row) => row.id === 1 },
          ]}
        />
      )}

      {/* FORM ADD / EDIT */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? `Sửa bậc thành viên - ${crud.selectedItem?.name}` : "Thêm bậc thành viên"}
          fields={[
            { name: "name", label: "Tên bậc thành viên", type: "text", required: true },
            { name: "limit", label: "Hạn mức (point)", type: "number", required: true, step: 1, min: 0 },
          ]}
          initialData={{
            ...crud.selectedItem,
            limit: crud.selectedItem?.limit != null ? Math.floor(crud.selectedItem.limit) : null,
          }}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
        />
      )}

      {/* DIALOG */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={closeDialog}
      />
    </div>
  );
};

export default memo(MemberLevelingList);
