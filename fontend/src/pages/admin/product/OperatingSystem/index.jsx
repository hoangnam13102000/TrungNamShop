import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import Pagination from "../../../../components/common/Pagination";

export default memo(function AdminOperatingSystemPage() {
  /** ==========================
   * 1. HOOK CRUD API
   * ========================== */
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("operating-systems");

  /** ==========================
   * 2. FETCH DATA
   * ========================== */
  const { data: operatingSystems = [], isLoading, refetch } = useGetAll();

  /** ==========================
   * 3. CRUD MUTATIONS
   * ========================== */
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const crud = useAdminCrud(
    {
      create: async (data) => {
        await createMutation.mutateAsync(data);
        await refetch();
      },
      update: async (id, data) => {
        await updateMutation.mutateAsync({ id, data });
        await refetch();
      },
      delete: async (id) => {
        await deleteMutation.mutateAsync({ id });
        await refetch();
      },
    },
    "operating-systems"
  );

  /** ==========================
   * 4. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không rõ"
  );

  /** ==========================
   * 5. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return operatingSystems.filter((os) =>
      os.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [operatingSystems, search]);

  /** ==========================
   * 6. PAGINATION
   * ========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // số item mỗi trang
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** ==========================
   * 7. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý Hệ điều hành</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm Hệ điều hành
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm hệ điều hành..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset về trang 1 khi search
          }}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <AdminListTable
              columns={[
                { field: "name", label: "Hệ điều hành" },
                { field: "processor", label: "Bộ xử lý" },
                { field: "cpu_speed", label: "Tốc độ CPU" },
                { field: "gpu", label: "GPU" },
              ]}
              data={paginatedItems} // sử dụng dữ liệu phân trang
              actions={[
                { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
                { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
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

      {/* FORM */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa Hệ điều hành" : "Thêm Hệ điều hành"}
          fields={[
            { name: "name", label: "Hệ điều hành", type: "text", required: true },
            { name: "processor", label: "Bộ xử lý", type: "text" },
            { name: "cpu_speed", label: "Tốc độ CPU", type: "text" },
            { name: "gpu", label: "GPU", type: "text" },
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
