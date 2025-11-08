import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import Pagination from "../../../../components/common/Pagination";

export default memo(function AdminScreenPage() {
  /** ==========================
   * 1. FETCH + CRUD API
   * ========================== */
  const { useGetAll, useCreate, useUpdate, useDelete } = useCRUDApi("screens");

  const { data: screens = [], isLoading, refetch } = useGetAll();
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "screens"
  );

  /** ==========================
   * 2. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.display_technology || "Không rõ"
  );

  /** ==========================
   * 3. SEARCH + FILTER
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return screens.filter((s) =>
      (s.display_technology || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [screens, search]);

  /** ==========================
   * 4. PAGINATION
   * ========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** ==========================
   * 5. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý màn hình</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm màn hình
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo công nghệ hiển thị..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
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
                { field: "display_technology", label: "Công nghệ hiển thị" },
                { field: "resolution", label: "Độ phân giải" },
                { field: "screen_size", label: "Kích thước (inch)" },
                { field: "max_brightness", label: "Độ sáng (nits)" },
                { field: "glass_protection", label: "Bảo vệ kính" },
              ]}
              data={paginatedItems}
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
          title={crud.mode === "edit" ? "Sửa màn hình" : "Thêm màn hình"}
          fields={[
            {
              name: "display_technology",
              label: "Công nghệ hiển thị",
              type: "text",
              required: true,
            },
            {
              name: "resolution",
              label: "Độ phân giải (VD: 2400x1080)",
              type: "text",
            },
            {
              name: "screen_size",
              label: "Kích thước (inch)",
              type: "number",
              step: "0.01",
            },
            {
              name: "max_brightness",
              label: "Độ sáng tối đa (nits)",
              type: "number",
            },
            {
              name: "glass_protection",
              label: "Bảo vệ kính (VD: Gorilla Glass 5)",
              type: "text",
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
