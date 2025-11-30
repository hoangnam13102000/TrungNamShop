import { memo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

const MemberLevelingList = () => {
  const api = useCRUDApi("account-leveling");
  const { data: levels = [], isLoading, isError, refetch } = api.useGetAll();
  const create = api.useCreate();
  const update = api.useUpdate();
  const remove = api.useDelete();

  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "member-levelings"
  );

  const { dialog, handleSave, handleDelete, showDialog, closeDialog } = useAdminHandler(crud, refetch, (item) => item?.name || "Không tên");

  const [search, setSearch] = useState("");

  // Handlers giữ nguyên logic business
  const onSave = async (formData) => {
    if (crud.selectedItem?.id === 1) {
      showDialog("alert", "Cảnh báo", "Không thể sửa bậc đặc biệt!");
      return;
    }
    if (formData.limit != null) formData.limit = Math.floor(Number(formData.limit));
    handleSave(formData, { name: "name" });
  };

  const onDelete = (item) => {
    if (item.id === 1) {
      showDialog("alert", "Cảnh báo", "Không thể xóa bậc đặc biệt!");
      return;
    }
    handleDelete(item, "name");
  };

  if (isLoading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu bậc thành viên.</div>;

  return (
    <>
      <AdminLayoutPage
        title="Bậc thành viên"
        description="Quản lý các bậc thành viên và hạn mức điểm"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onAdd={crud.handleAdd}
        tableColumns={[
          { field: "name", label: "Tên bậc thành viên" },
          { field: "limit", label: "Hạn mức (point)" },
        ]}
        tableData={levels} // trả toàn bộ data, AdminLayoutPage sẽ handle search & pagination
        tableActions={[
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit, disabled: (row) => row.id === 1 },
          { icon: <FaTrash />, label: "Xóa", onClick: onDelete, disabled: (row) => row.id === 1 },
        ]}
        formModal={{
          open: crud.openForm,
          title: crud.mode === "edit" ? `Sửa bậc thành viên - ${crud.selectedItem?.name}` : "Thêm bậc thành viên",
          fields: [
            { name: "name", label: "Tên bậc thành viên", type: "text", required: true },
            { name: "limit", label: "Hạn mức (point)", type: "number", required: true, step: 1, min: 0 },
          ],
          initialData: {
            ...crud.selectedItem,
            limit: crud.selectedItem?.limit != null ? Math.floor(crud.selectedItem.limit) : null,
          },
          errors: crud.errors,
        }}
        onFormSave={onSave}
        onFormClose={crud.handleCloseForm}
      />

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={closeDialog}
      />
    </>
  );
};

export default memo(MemberLevelingList);
