import { memo, useState, useMemo } from "react";
import {
  FaEdit,
  FaEye,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaTransgender,
  FaBirthdayCake,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import AdminLayoutPage from "../../../../components/common/Layout";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import CommonViewDialog from "../../../../components/users/CommonViewDialog";
import { getImageUrl } from "../../../../utils/helpers/getImageUrl";
import placeholder from "../../../../assets/admin/logoicon1.jpg";

const CustomerManagement = () => {
  // ================= API =================
  const customerAPI = useCRUDApi("customers");
  const { data: customers = [], isLoading, isError, refetch } =
    customerAPI.useGetAll();
  const create = customerAPI.useCreate();
  const update = customerAPI.useUpdate();

  // ================= CRUD =================
  const crud = useAdminCrud(
    {
      create: async (data) => {
        const payload = { ...data };
        delete payload.email;
        return create.mutateAsync(payload);
      },
      update: async (id, data) => {
        const payload = { ...data };
        delete payload.email;
        return update.mutateAsync({ id, data: payload });
      },
    },
    "customers"
  );

  const { dialog, handleSave, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.full_name || "Không tên"
  );

  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewItem, setViewItem] = useState(null);
  const itemsPerPage = 5;

  // ================= FILTER =================
  const filteredItems = useMemo(() => {
    return customers.filter((c) =>
      (c.full_name || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );
  }, [customers, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  // ================= TABLE =================
  const tableColumns = [
    { field: "account.username", label: "Username" },
    { field: "full_name", label: "Họ tên" },
    { field: "phone_number", label: "SĐT" },
    { field: "account.email", label: "Email" },
    {
      field: "birth_date",
      label: "Ngày sinh",
      render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
    },
    {
      field: "avatar",
      label: "Ảnh đại diện",
      render: (_, row) => {
        const imgUrl = getImageUrl(row.avatar) || placeholder;
        return (
          <img
            src={imgUrl}
            alt="avatar"
            className="w-16 h-16 object-cover rounded-full border"
            onError={(e) => (e.target.src = placeholder)}
          />
        );
      },
    },
  ];

  // ================= ACTIONS =================
  const tableActions = [
    { icon: <FaEye />, label: "Xem", onClick: setViewItem },
    {
      icon: <FaEdit />,
      label: "Sửa",
      onClick: (item) => {
        crud.handleEdit({
          ...item,
          username: item.account?.username || "",
          email: item.account?.email || "", // ✅ QUAN TRỌNG
        });
      },
    },
  ];

  // ================= FORM =================
  const formFields = [
    { name: "username", label: "Username", type: "text", disabled: true },

    {
      name: "email",
      label: "Email",
      type: "email",
      disabled: true,
    },

    { name: "full_name", label: "Họ tên", type: "text", required: true },
    { name: "address", label: "Địa chỉ", type: "text" },
    { name: "phone_number", label: "SĐT", type: "text" },
    { name: "birth_date", label: "Ngày sinh", type: "date" },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
      ],
    },
    { name: "avatar", label: "Ảnh đại diện", type: "file" },
  ];

  // ================= RENDER =================
  if (isLoading)
    return <div className="p-6 text-center">Đang tải...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi tải dữ liệu khách hàng
      </div>
    );

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
        tableColumns={tableColumns}
        tableData={paginatedItems}
        tableActions={tableActions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        formModal={{
          open: crud.openForm,
          title: "Sửa khách hàng",
          fields: formFields,
          initialData: crud.selectedItem,
          errors: crud.errors,
        }}
        onFormSave={handleSave}
        onFormClose={crud.handleCloseForm}
      />

      {/* ===== VIEW DIALOG ===== */}
      {viewItem && (
        <CommonViewDialog
          title="Chi tiết khách hàng"
          open={!!viewItem}
          onClose={() => setViewItem(null)}
          avatar={getImageUrl(viewItem.avatar) || placeholder}
          data={[
            {
              icon: <FaUser />,
              label: "Username",
              value: viewItem.account?.username || "—",
            },
            {
              icon: <FaEnvelope />,
              label: "Email",
              value: viewItem.account?.email || "—",
            },
            {
              icon: <FaPhone />,
              label: "SĐT",
              value: viewItem.phone_number || "—",
            },
            {
              icon: <FaMapMarkerAlt />,
              label: "Địa chỉ",
              value: viewItem.address || "—",
            },
            {
              icon: <FaTransgender />,
              label: "Giới tính",
              value: viewItem.gender === "male" ? "Nam" : "Nữ",
            },
            {
              icon: <FaBirthdayCake />,
              label: "Ngày sinh",
              value: viewItem.birth_date
                ? new Date(viewItem.birth_date).toLocaleDateString()
                : "—",
            },
          ]}
        />
      )}

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />
    </>
  );
};

export default memo(CustomerManagement);
