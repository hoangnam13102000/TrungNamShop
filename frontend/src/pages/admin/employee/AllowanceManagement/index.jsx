import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const AllowanceManagement = () => {
  /** 1. FETCH DATA */
  const allowanceAPI = useCRUDApi("allowances");
  const { data: allowances = [], isLoading, isError, refetch } = allowanceAPI.useGetAll();
  const create = allowanceAPI.useCreate();
  const update = allowanceAPI.useUpdate();
  const remove = allowanceAPI.useDelete();

  /** 2. CRUD HOOK */
  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "allowances"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch);

  /** 3. SEARCH STATE */
  const [search, setSearch] = useState("");

  /** 4. FILTER DATA */
  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return allowances.filter(
      (a) =>
        a.allowance_name?.toLowerCase().includes(term) ||
        String(a.allowance_amount ?? "").includes(term)
    );
  }, [allowances, search]);

  /** 5. TABLE CONFIG */
  const tableColumns = [
    { field: "allowance_name", label: "Tên phụ cấp" },
    {
      field: "allowance_amount",
      label: "Số tiền (VNĐ)",
      render: (v) => Number(v ?? 0).toLocaleString("vi-VN") + " VNĐ",
    },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
  ];

  /** 6. LOADING / ERROR */
  if (isLoading)
    return <div className="p-6 sm:p-8 text-center text-gray-600">Đang tải dữ liệu...</div>;
  if (isError)
    return <div className="p-6 sm:p-8 text-center text-red-500">Lỗi tải dữ liệu phụ cấp!</div>;

  /** 7. UI */
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AdminLayoutPage
        title="Quản lý phụ cấp"
        description="Quản lý các loại phụ cấp và số tiền"
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
              title={crud.mode === "edit" ? "Sửa phụ cấp" : "Thêm phụ cấp mới"}
              fields={[
                { name: "allowance_name", label: "Tên phụ cấp", type: "text", required: true },
                { name: "allowance_amount", label: "Số tiền (VNĐ)", type: "number", required: true, min: 0, step: 0.01 },
              ]}
              initialData={crud.selectedItem}
              onSave={(data) => handleSave(data, "allowance_name", "allowance_amount")}
              onClose={crud.handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
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

export default memo(AllowanceManagement);
