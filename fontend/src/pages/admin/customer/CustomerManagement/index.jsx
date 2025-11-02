import { memo, useMemo, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import placeholder from "../../../../assets/admin/logoicon1.jpg";
import { useCustomers, useUpdateCustomer } from "../../../../api/customer";
import { getImageUrl } from "../../../../utils/getImageUrl";

export default memo(function CustomerManagement() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const { data: customers = [], isLoading, refetch } = useCustomers();

  /** ==========================
   * 2. CRUD MUTATIONS
   * ========================== */
  const updateMutation = useUpdateCustomer();
  const crud = useAdminCrud(
    {
      update: async (id, fd) => await updateMutation.mutateAsync({ id, data: fd }),
    },
    "customers"
  );

  /** ==========================
   * 3. ADMIN HANDLER
   * ========================== */
  const { dialog, closeDialog, handleSave: handleSaveAdmin } = useAdminHandler(
    crud,
    refetch
  );

  /** ==========================
   * 4. STATE
   * ========================== */
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  /** ==========================
   * 5. FILTER DATA
   * ========================== */
  const filteredItems = useMemo(() => {
    return customers.filter((c) =>
      (c.full_name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [customers, search]);

  /** ==========================
   * 6. HANDLE SAVE
   * ========================== */
  const handleSave = async (formData) => {
    await handleSaveAdmin(formData);
  };

  /** ==========================
   * 7. UI RENDER
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-center">Quản lý khách hàng</h1>

      {/* SEARCH */}
      <div className="flex justify-end mb-6">
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
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <AdminListTable
            columns={[
              { field: "account.username", label: "Username" },
              { field: "full_name", label: "Họ tên" },
              { field: "phone_number", label: "SĐT" },
              { field: "email", label: "Email" },
              { field: "address", label: "Địa chỉ" },
              {
                field: "gender",
                label: "Giới tính",
                render: (v) => (v === "male" ? "Nam" : "Nữ"),
              },
              {
                field: "birth_date",
                label: "Ngày sinh",
                render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
              },
              {
                field: "avatar",
                label: "Ảnh đại diện",
                render: (value, row) => {
                  const imgUrl = getImageUrl(row.avatar);
                  return (
                    <div className="flex justify-center">
                      <img
                        src={imgUrl || placeholder}
                        alt="avatar"
                        className="w-16 h-16 object-cover rounded-full border"
                        onError={(e) => {
                          if (e.target.src !== placeholder) e.target.src = placeholder;
                        }}
                      />
                    </div>
                  );
                },
              },
            ]}
            data={filteredItems}
            actions={[
              { icon: <FaEye />, label: "Xem", onClick: setViewItem },
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
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
            { name: "account.username", label: "Username", type: "text", disabled: true },
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
              ],
            },
            { name: "birth_date", label: "Ngày sinh", type: "date", disabled: true },
            {
              name: "avatar",
              label: "Ảnh đại diện",
              type: "custom-image", // render <img> trực tiếp
            },
          ]}
          initialData={{
            ...viewItem,
            "account.username": viewItem.account?.username || "Không có username",
            avatar: viewItem.avatar ? getImageUrl(viewItem.avatar) : placeholder,
            birth_date: viewItem.birth_date || null,
          }}
          onClose={() => setViewItem(null)}
          className="w-full max-w-lg mx-auto"
        />
      )}

      {/* FORM: EDIT */}
      {crud.openForm && (
        <DynamicForm
          title={`Chỉnh sửa khách hàng - ${crud.selectedItem?.full_name}`}
          fields={[
            { name: "account.username", label: "Username", type: "text", disabled: true },
            { name: "account_id", label: "Tài khoản", type: "hidden" },
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
              ],
            },
            { name: "birth_date", label: "Ngày sinh", type: "date" },
            { name: "avatar", label: "Ảnh đại diện", type: "file" },
          ]}
          initialData={{
            ...crud.selectedItem,
            "account.username": crud.selectedItem.account?.username || "",
            account_id: crud.selectedItem.account?.id || null,
            avatar: crud.selectedItem.avatar ? getImageUrl(crud.selectedItem.avatar) : null,
            birth_date: crud.selectedItem.birth_date || null,
          }}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          mode={crud.mode}
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
