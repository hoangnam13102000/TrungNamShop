import { memo, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

export default memo(function AdminReviewPage() {
  /** ==========================
   *  1. API HOOKS
   * ========================== */
  const { useGetAll, useUpdate, useDelete } = useCRUDApi("reviews");

  const { data: reviews = [], isLoading, refetch } = useGetAll();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  /** ==========================
   *  2. CRUD HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "reviews"
  );

  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.content || "Không rõ"
  );

  /** ==========================
   *  3. SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return reviews.filter((r) =>
      r.content?.toLowerCase().includes(search.toLowerCase())
    );
  }, [reviews, search]);

  /** ==========================
   *  4. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý đánh giá</h1>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo nội dung..."
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
              { field: "name", label: "Tên tài khoản" },
              { field: "content", label: "Nội dung" },
              { field: "stars", label: "Số sao" },
              { field: "date", label: "Ngày đánh giá" },
            ]}
            data={filteredItems}
            actions={[
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
            ]}
          />
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
});