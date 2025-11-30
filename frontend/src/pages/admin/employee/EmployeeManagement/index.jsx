import { memo, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import CommonViewDialog from "../../../../components/users/CommonViewDialog";
import { getImageUrl } from "../../../../utils/helpers/getImageUrl";
import placeholder from "../../../../assets/admin/logoicon1.jpg";
import { FaUser, FaPhone, FaEnvelope, FaTransgender, FaBirthdayCake, FaStore } from "react-icons/fa";

const EmployeeManagement = () => {
  // 1. API
  const employeeAPI = useCRUDApi("employees");
  const positionAPI = useCRUDApi("positions");
  const storeAPI = useCRUDApi("stores");

  const { data: employees = [], isLoading, isError, refetch } = employeeAPI.useGetAll();
  const { data: positions = [] } = positionAPI.useGetAll();
  const { data: stores = [] } = storeAPI.useGetAll();
  const updateMutation = employeeAPI.useUpdate();

  // 2. CRUD
  const crud = useAdminCrud(
    { update: async (id, fd) => await updateMutation.mutateAsync({ id, data: fd }) },
    "employees"
  );
  const { dialog, handleSave: handleSaveAdmin, closeDialog } = useAdminHandler(crud, refetch);

  // 3. STATE
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  const handleSave = async (formData) => await handleSaveAdmin(formData);

  // 4. Table config
  const tableColumns = [
    { field: "account.username", label: "Username" },
    { field: "full_name", label: "Họ tên" },
    { field: "position.name", label: "Chức vụ" },
    { field: "store.name", label: "Cửa hàng làm việc" },
    { field: "phone_number", label: "SĐT" },
    { field: "email", label: "Email" },
    { field: "birth_date", label: "Ngày sinh", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
    { field: "created_at", label: "Ngày vào làm", render: (v) => (v ? new Date(v).toLocaleDateString() : "—") },
  ];

  const tableActions = [
    { icon: <FaEye />, label: "Xem", onClick: setViewItem },
    { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
  ];

  // 5. Form fields
  const formFields = [
    { name: "account.username", label: "Username", type: "text", disabled: true },
    { name: "full_name", label: "Họ tên", type: "text", required: true },
    { name: "position_id", label: "Chức vụ", type: "select", options: positions.map(p => ({ label: p.name, value: p.id })), required: true },
    { name: "store_id", label: "Cửa hàng làm việc", type: "select", options: stores.map(s => ({ label: s.name, value: s.id })) },
    { name: "phone_number", label: "SĐT", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "birth_date", label: "Ngày sinh", type: "date" },
    { name: "avatar", label: "Ảnh đại diện", type: "file" },
  ];

  if (isLoading) return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu nhân viên.</div>;

  return (
    <>
      <AdminLayoutPage
        title="Nhân viên"
        description="Quản lý thông tin và chỉnh sửa dữ liệu nhân viên"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onAdd={crud.handleAdd}
        tableColumns={tableColumns}
        tableData={employees}
        tableActions={tableActions}
        formModal={{
          open: crud.openForm,
          title: `Chỉnh sửa nhân viên - ${crud.selectedItem?.full_name || ""}`,
          fields: formFields,
          initialData: crud.selectedItem
            ? {
                ...crud.selectedItem,
                "account.username": crud.selectedItem.account?.username || "",
                position_id: crud.selectedItem.position?.id || "",
                store_id: crud.selectedItem.store?.id || "",
                avatar: crud.selectedItem.avatar ? getImageUrl(crud.selectedItem.avatar) : null,
                birth_date: crud.selectedItem.birth_date || null,
              }
            : {},
          errors: crud.errors,
        }}
        onFormSave={handleSave}
        onFormClose={crud.handleCloseForm}
        dialogProps={dialog}
      />

      {/* VIEW DIALOG */}
      {viewItem && (
        <CommonViewDialog
          title={`Chi tiết nhân viên`}
          open={!!viewItem}
          onClose={() => setViewItem(null)}
          data={[
            { icon: <FaUser />, label: "Username", value: viewItem.account?.username || "—" },
            { icon: <FaUser />, label: "Họ tên", value: viewItem.full_name },
            { icon: <FaPhone />, label: "SĐT", value: viewItem.phone_number },
            { icon: <FaEnvelope />, label: "Email", value: viewItem.email },
            { icon: <FaStore />, label: "Cửa hàng", value: viewItem.store?.name || "—" },
            { icon: <FaTransgender />, label: "Giới tính", value: viewItem.gender === "male" ? "Nam" : "Nữ" },
            { icon: <FaBirthdayCake />, label: "Ngày sinh", value: viewItem.birth_date ? new Date(viewItem.birth_date).toLocaleDateString() : "—" },
            { icon: <FaBirthdayCake />, label: "Ngày vào làm", value: viewItem.created_at ? new Date(viewItem.created_at).toLocaleDateString() : "—" },
          ]}
          avatar={getImageUrl(viewItem.avatar) || placeholder}
        />
      )}

      {/* CONFIRM / ALERT DIALOG */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}       // đóng
        onCancel={closeDialog}      // huỷ
        onConfirm={dialog.onConfirm} 
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        closeText={dialog.closeText}
        customButtons={dialog.customButtons}
      />
    </>
  );
};

export default memo(EmployeeManagement);
