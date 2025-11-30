import { memo, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";

import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const SalaryCoefficientManagement = () => {
  /** 1. FETCH DATA & CRUD API */
  const salaryAPI = useCRUDApi("salary-coefficients");
  const { data: salaryCoefficients = [], isLoading, isError, refetch } = salaryAPI.useGetAll();
  const create = salaryAPI.useCreate();
  const update = salaryAPI.useUpdate();
  const remove = salaryAPI.useDelete();

  /** 2. CRUD HOOK */
  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "salary-coefficients"
  );

  /** 3. STATE + HANDLER */
  const [search, setSearch] = useState("");
  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(crud, refetch);

  /** 4. FILTER DATA */
  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return salaryCoefficients.filter(
      (s) =>
        s.coefficient_name?.toLowerCase().includes(term) ||
        String(s.coefficient_value ?? "").includes(term)
    );
  }, [salaryCoefficients, search]);

  /** 5. TABLE CONFIG */
  const tableColumns = [
    { field: "coefficient_name", label: "Tên hệ số lương" },
    {
      field: "coefficient_value",
      label: "Hệ số",
      render: (v) => Number(v ?? 0).toFixed(2),
    },
  ];

  const tableActions = [
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
  ];

  /** 6. LOADING / ERROR */
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  if (isError)
    return <div className="p-6 text-center text-red-500">Lỗi tải dữ liệu hệ số lương!</div>;

  /** 7. RENDER */
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AdminLayoutPage
        title="Quản lý hệ số lương"
        description="Quản lý các hệ số lương và giá trị"
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
              title={crud.mode === "edit" ? "Sửa hệ số lương" : "Thêm hệ số lương mới"}
              fields={[
                { name: "coefficient_name", label: "Tên hệ số lương", type: "text", required: true },
                { name: "coefficient_value", label: "Hệ số", type: "number", required: true, min: 0, step: 0.01 },
              ]}
              initialData={crud.selectedItem}
              onSave={(data) => handleSave(data, "coefficient_name", "coefficient_value")}
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

export default memo(SalaryCoefficientManagement);
