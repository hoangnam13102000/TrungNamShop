import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
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
  const { data: levels = [], isLoading, refetch } = useMemberLevelings();
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

  /** ==========================
   * 2. ADMIN HANDLER
   * ========================== */
  const { dialog, showDialog, closeDialog, handleSave, handleDelete } =
    useAdminHandler(crud, refetch);

  const [search, setSearch] = useState("");

  /** ==========================
   * 3. FILTER DATA & FORMAT
   * ========================== */
  const filteredItems = useMemo(() => {
    return levels
      .filter((l) =>
        (l.name || "").toLowerCase().includes(search.toLowerCase().trim())
      )
      .map((l) => ({
        ...l,
        limit: l.limit != null ? Math.floor(Number(l.limit)) : null,
      }));
  }, [levels, search]);

  /** ==========================
   * 4. CUSTOM HANDLERS (đặc biệt)
   * ========================== */
  const onSave = async (formData) => {
    // No Edit
    if (crud.selectedItem?.id === 1) {
      showDialog("alert", "Cảnh báo", "Không thể sửa bậc đặc biệt!");
      return;
    }

    // force limit to an integer
    if (formData.limit != null) {
      formData.limit = Math.floor(Number(formData.limit));
    }

    //Use hook handleSave for confirm + dialog
    handleSave(formData, { name: "name" });
  };

  const onDelete = (item) => {
    // No Delete
    if (item.id === 1) {
      showDialog("alert", "Cảnh báo", "Không thể xóa bậc đặc biệt!");
      return;
    }

    // use hook handleDelete
    handleDelete(item, "name");
  };

  /** ==========================
   * 5. UI
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
            {
              icon: <FaEdit />,
              label: "Sửa",
              onClick: crud.handleEdit,
              disabled: (row) => row.id === 1,
            },
            {
              icon: <FaTrash />,
              label: "Xóa",
              onClick: onDelete,
              disabled: (row) => row.id === 1,
            },
          ]}
        />
      )}

      {/* FORM ADD / EDIT */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Sửa bậc thành viên - ${crud.selectedItem?.name}`
              : "Thêm bậc thành viên"
          }
          fields={[
            {
              name: "name",
              label: "Tên bậc thành viên",
              type: "text",
              required: true,
            },
            {
              name: "limit",
              label: "Hạn mức (point)",
              type: "number",
              required: true,
              step: 1,
              min: 0,
            },
          ]}
          initialData={{
            ...crud.selectedItem,
            limit:
              crud.selectedItem?.limit != null
                ? Math.floor(crud.selectedItem.limit)
                : null,
          }}
          onSave={onSave}
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
