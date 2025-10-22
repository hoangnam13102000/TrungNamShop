import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  // useDeleteCustomer,
} from "../../../../api/customer";

export default memo(function CustomerManagement() {
  /** ==========================
   *  1. FETCH DATA
   *  ========================== */
  const { data: customers = [], isLoading, refetch } = useCustomers();

  /** ==========================
   *  2. CRUD MUTATIONS
   *  ========================== */
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  // const deleteMutation = useDeleteCustomer();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      // delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "customers"
  );

  /** ==========================
   *  3. ADMIN HANDLER
   *  ========================== */
  const { dialog, closeDialog, handleSave } = useAdminHandler(crud, refetch);

  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  /** ==========================
   *  4. FILTER & MAP DATA
   *  ========================== */
  const filteredItems = useMemo(() => {
    return customers.filter((c) =>
      (c.full_name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [customers, search]);

  const mappedItems = useMemo(() => {
    return filteredItems.map((c) => ({
      ...c,
      username: c.username ?? c.account?.username ?? "Không có",
      gender_label:
        c.gender === "male"
          ? "Nam"
          : c.gender === "female"
          ? "Nữ"
          : "Không xác định",
    }));
  }, [filteredItems]);

  /** ==========================
   *  5. UI
   *  ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý khách hàng</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm khách hàng
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
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
              { field: "username", label: "Username" },
              { field: "full_name", label: "Họ tên" },
              { field: "phone_number", label: "SĐT" },
              { field: "email", label: "Email" },
              { field: "address", label: "Địa chỉ" },
              { field: "gender_label", label: "Giới tính" },
            ]}
            data={mappedItems}
            actions={[
              { icon: <FaEye />, label: "Xem", onClick: setViewItem },
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              // { icon: <FaTrash />, label: "Xoá", onClick: (item) => handleDelete(item, "full_name") },
            ]}
          />
        </div>
      )}

      {/* FORM: VIEW */}
      {viewItem && (
        <DynamicForm
          mode="view"
          title={`Chi tiết khách hàng - ${viewItem.full_name}`}
          fields={[
            { name: "username", label: "Username", type: "text" },
            { name: "full_name", label: "Họ tên", type: "text" },
            { name: "phone_number", label: "SĐT", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "address", label: "Địa chỉ", type: "text" },
            {
              name: "gender",
              label: "Giới tính",
              type: "select",
              options: [
                { label: "Nam", value: "male" },
                { label: "Nữ", value: "female" },
                { label: "Không xác định", value: null },
              ],
            },
          ]}
          initialData={viewItem}
          onClose={() => setViewItem(null)}
          className="w-full max-w-lg mx-auto"
        />
      )}

      {/* FORM: EDIT / CREATE */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Chỉnh sửa khách hàng - ${crud.selectedItem?.full_name}`
              : "Thêm khách hàng"
          }
          fields={[
            { name: "username", label: "Username", type: "text", required: true },
            { name: "full_name", label: "Họ tên", type: "text", required: true },
            { name: "phone_number", label: "SĐT", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "address", label: "Địa chỉ", type: "text" },
            {
              name: "gender",
              label: "Giới tính",
              type: "select",
              options: [
                { label: "Nam", value: "male" },
                { label: "Nữ", value: "female" },
                { label: "Không xác định", value: null },
              ],
            },
          ]}
          initialData={crud.selectedItem}
          onSave={(formData) =>
            handleSave(formData, { name: "full_name" })
          }
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
