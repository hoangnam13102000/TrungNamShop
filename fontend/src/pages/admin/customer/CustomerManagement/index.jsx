import { memo, useMemo, useState } from "react";
import { FaEdit, FaEye, FaUser, FaPhone, FaEnvelope, FaTransgender, FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import CommonViewDialog from "../../../../components/users/CommonViewDialog";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import placeholder from "../../../../assets/admin/logoicon1.jpg";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import { getImageUrl } from "../../../../utils/helpers/getImageUrl";
import Pagination from "../../../../components/common/Pagination";

export default memo(function CustomerManagement() {
  /** ========================== 1. FETCH DATA ========================== */
  const { useGetAll: useGetCustomers, useUpdate: useUpdateCustomer } = useCRUDApi("customers");
  const { data: customers = [], isLoading: loadingCustomers, refetch: refetchCustomers } = useGetCustomers();
  const updateMutation = useUpdateCustomer();

  /** ========================== 2. CRUD ========================== */
  const crud = useAdminCrud(
    {
      update: async (id, fd) => await updateMutation.mutateAsync({ id, data: fd }),
    },
    "customers"
  );

  const { dialog, closeDialog, handleSave: handleSaveAdmin } = useAdminHandler(crud, refetchCustomers);

  /** ========================== 3. STATE ========================== */
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /** ========================== 4. FILTER & PAGINATION ========================== */
  const filteredItems = useMemo(() => {
    return customers.filter((c) =>
      (c.full_name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [customers, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  /** ========================== 5. HANDLE SAVE ========================== */
  const handleSave = async (formData) => {
    await handleSaveAdmin(formData);
  };

  /** ========================== 6. UI ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-center">Quản lý khách hàng</h1>

      {/* SEARCH */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* TABLE */}
      {loadingCustomers ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <AdminListTable
            columns={[
              { field: "account.username", label: "Username" },
              { field: "full_name", label: "Họ tên" },
              { field: "phone_number", label: "SĐT" },
              { field: "email", label: "Email" },
              {
                field: "birth_date",
                label: "Ngày sinh",
                render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
              },
              {
                field: "created_at",
                label: "Ngày tạo",
                render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
              },
              {
                field: "avatar",
                label: "Ảnh đại diện",
                render: (value, row) => {
                  const imgUrl = getImageUrl(row.avatar) || placeholder;
                  return (
                    <div className="flex justify-center">
                      <img
                        src={imgUrl}
                        alt="avatar"
                        className="w-16 h-16 object-cover rounded-full border"
                        onError={(e) => (e.target.src = placeholder)}
                      />
                    </div>
                  );
                },
              },
            ]}
            data={currentItems}
            actions={[
              { icon: <FaEye />, label: "Xem", onClick: setViewItem },
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
            ]}
          />
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxVisible={5}
        />
      )}

      {/* VIEW DIALOG */}
      {viewItem && (
        <CommonViewDialog
          title={`Chi tiết khách hàng`}
          open={!!viewItem}
          onClose={() => setViewItem(null)}
          data={[
            { icon: <FaUser />, label: "Username", value: viewItem.account?.username || "Không có" },
            { icon: <FaUser />, label: "Họ tên", value: viewItem.full_name },
            { icon: <FaPhone />, label: "SĐT", value: viewItem.phone_number },
            { icon: <FaEnvelope />, label: "Email", value: viewItem.email },
            { icon: <FaMapMarkerAlt />, label: "Địa chỉ", value: viewItem.address || "—" },
            { icon: <FaTransgender />, label: "Giới tính", value: viewItem.gender === "male" ? "Nam" : "Nữ" },
            { icon: <FaBirthdayCake />, label: "Ngày sinh", value: viewItem.birth_date ? new Date(viewItem.birth_date).toLocaleDateString() : "—" },
            { icon: <FaBirthdayCake />, label: "Ngày tạo", value: viewItem.created_at ? new Date(viewItem.created_at).toLocaleDateString() : "—" },
          ]}
          avatar={getImageUrl(viewItem.avatar) || placeholder}
        />
      )}

      {/* EDIT FORM */}
      {crud.openForm && (
        <DynamicForm
          title={`Chỉnh sửa khách hàng - ${crud.selectedItem?.full_name}`}
          fields={[
            { name: "account.username", label: "Username", type: "text", disabled: true },
            { name: "full_name", label: "Họ tên", type: "text", required: true },
            { name: "address", label: "Địa chỉ", type: "text" },
            { name: "phone_number", label: "SĐT", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "birth_date", label: "Ngày sinh", type: "date" },
            { name: "gender", label: "Giới tính", type: "select", options: [
                { label: "Nam", value: "male" },
                { label: "Nữ", value: "female" },
              ]
            },
            { name: "avatar", label: "Ảnh đại diện", type: "file" },
          ]}
          initialData={{
            ...crud.selectedItem,
            "account.username": crud.selectedItem.account?.username || "",
            avatar: crud.selectedItem.avatar ? getImageUrl(crud.selectedItem.avatar) : null,
            birth_date: crud.selectedItem.birth_date || null,
          }}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          mode={crud.mode}
          className="w-full max-w-lg mx-auto"
        />
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
});
