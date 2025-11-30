import { memo, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const PositionManagement = () => {
  /** 1. FETCH DATA & CRUD API */
  const positionAPI = useCRUDApi("positions");
  const { data: positions = [], isLoading, isError, refetch } = positionAPI.useGetAll();
  const create = positionAPI.useCreate();
  const update = positionAPI.useUpdate();
  const remove = positionAPI.useDelete();

  /** 2. CRUD HOOK */
  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "positions"
  );

  /** 3. STATE + HANDLER */
  const [search, setSearch] = useState("");
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch);

  /** 4. FILTER DATA */
  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return positions.filter(
      (pos) =>
        (pos.name ?? "").toLowerCase().includes(term) ||
        (pos.base_salary ?? "").toString().includes(term)
    );
  }, [positions, search]);

  /** 5. TABLE CONFIG */
  const tableColumns = [
    { field: "name", label: "Tên chức vụ" },
    {
      field: "base_salary",
      label: "Lương cơ bản (VNĐ)",
      render: (value) => Number(value ?? 0).toLocaleString("vi-VN") + " VNĐ",
    },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xoá", onClick: (item) => handleDelete(item, "name") },
  ];

  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  if (isError)
    return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu chức vụ.</div>;

  /** 6. RENDER */
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AdminLayoutPage
        title="Quản lý chức vụ"
        description="Quản lý các chức vụ và lương cơ bản"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onAdd={crud.handleAdd}
        tableColumns={tableColumns}
        tableData={filteredItems}
        tableActions={tableActions}
      />

      {/* FORM MODAL */}
      {crud.openForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-4 sm:pt-8 md:pt-10 z-50 overflow-y-auto p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl sm:max-w-3xl my-4">
            <DynamicForm
              title={crud.mode === "edit" ? "Sửa chức vụ" : "Thêm chức vụ mới"}
              fields={[
                { name: "name", label: "Tên chức vụ", type: "text", required: true },
                { name: "base_salary", label: "Lương cơ bản (VNĐ)", type: "number", min: 0, required: true },
              ]}
              initialData={crud.selectedItem}
              onSave={(data) => handleSave(data, { name: "name", money: "base_salary" })}
              onClose={crud.handleCloseForm}
            />
          </div>
        </div>
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
};

export default memo(PositionManagement);
