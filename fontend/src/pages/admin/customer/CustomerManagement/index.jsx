import { memo, useState, useMemo } from "react";
import { FaEdit, FaEye, FaUser, FaPhone, FaEnvelope, FaTransgender, FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import CommonViewDialog from "../../../../components/users/CommonViewDialog";
import { getImageUrl } from "../../../../utils/helpers/getImageUrl";
import placeholder from "../../../../assets/admin/logoicon1.jpg";

const CustomerManagement = () => {
  const customerAPI = useCRUDApi("customers");
  const { data: customers = [], isLoading, isError, refetch } = customerAPI.useGetAll();
  const create = customerAPI.useCreate();
  const update = customerAPI.useUpdate();

  // CRUD logic
  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
    },
    "customers"
  );

  // Dialog + Save handler
  const { dialog, handleSave, closeDialog } = useAdminHandler(crud, refetch, (item) => item?.full_name || "Không tên");

  // Search & pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewItem, setViewItem] = useState(null);
  const itemsPerPage = 5;

  const filteredItems = useMemo(
    () => customers.filter((c) => (c.full_name || "").toLowerCase().includes(search.toLowerCase().trim())),
    [customers, search]
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  // Table columns and actions
  const tableColumns = [
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
      field: "avatar",
      label: "Ảnh đại diện",
      render: (value, row) => {
        const imgUrl = getImageUrl(row.avatar) || placeholder;
        return <img src={imgUrl} alt="avatar" className="w-16 h-16 object-cover rounded-full border" onError={(e) => (e.target.src = placeholder)} />;
      },
    },
  ];

  const tableActions = [
    { icon: <FaEye />, label: "Xem", onClick: setViewItem },
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
  ];

  // Form fields
  const formFields = [
    { name: "account.username", label: "Username", type: "text", disabled: true },
    { name: "full_name", label: "Họ tên", type: "text", required: true },
    { name: "address", label: "Địa chỉ", type: "text" },
    { name: "phone_number", label: "SĐT", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "birth_date", label: "Ngày sinh", type: "date" },
    { name: "gender", label: "Giới tính", type: "select", options: [{ label: "Nam", value: "male" }, { label: "Nữ", value: "female" }] },
    { name: "avatar", label: "Ảnh đại diện", type: "file" },
  ];

  if (isLoading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu khách hàng.</div>;

  return (
    <>
      <AdminLayoutPage
        title="Khách hàng"
        description="Quản lý thông tin khách hàng"
        searchValue={search}
        onSearchChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        onAdd={crud.handleAdd}
        tableColumns={tableColumns}
        tableData={paginatedItems}
        tableActions={tableActions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        formModal={{
          open: crud.openForm,
          title: crud.mode === "edit" ? "Sửa khách hàng" : "Thêm khách hàng",
          fields: formFields,
          initialData: crud.selectedItem,
          errors: crud.errors,
        }}
        onFormSave={handleSave}
        onFormClose={crud.handleCloseForm}
      />

      {/* View dialog */}
      {viewItem && (
        <CommonViewDialog
          title="Chi tiết khách hàng"
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

      {/* Dialog confirm / success / error */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        closeText={dialog.closeText}
        customButtons={dialog.customButtons}
      />
    </>
  );
};

export default memo(CustomerManagement);
