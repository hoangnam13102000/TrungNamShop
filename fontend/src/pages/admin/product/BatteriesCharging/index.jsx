import { memo, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

export default memo(function AdminBatteryPage() {
  const batteryApi = useCRUDApi("batteries-charging");
  const { data: batteries = [], isLoading, refetch } = batteryApi.useGetAll();

  const createMutation = batteryApi.useCreate();
  const updateMutation = batteryApi.useUpdate();
  const deleteMutation = batteryApi.useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "batteries_charging"
  );

  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) =>
      `${item?.battery_capacity || "Không rõ"} (${item?.charging_port || "Không rõ"})`
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    return batteries.filter(
      (b) =>
        b.battery_capacity?.toLowerCase().includes(keyword) ||
        b.charging_port?.toLowerCase().includes(keyword) ||
        b.charging?.toLowerCase().includes(keyword)
    );
  }, [batteries, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

 
  if (isLoading) {
    return <div className="p-4 text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <AdminLayoutPage
      title="Quản lý pin"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "battery_capacity", label: "Dung lượng pin" },
        { field: "charging_port", label: "Cổng sạc" },
        { field: "charging", label: "Công nghệ sạc" },
      ]}
      tableData={paginatedItems}
      tableActions={[
        { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
      ]}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      formModal={{
        open: crud.openForm,
        title: crud.mode === "edit" ? "Sửa pin" : "Thêm pin",
        fields: [
          { name: "battery_capacity", label: "Dung lượng pin", type: "text", required: true },
          { name: "charging_port", label: "Cổng sạc", type: "text" },
          { name: "charging", label: "Công nghệ sạc", type: "text" },
        ],
        initialData: crud.selectedItem,
      }}
      onFormSave={handleSave}
      onFormClose={crud.handleCloseForm}
      dialogProps={{
        open: dialog.open,
        mode: dialog.mode,
        title: dialog.title,
        message: dialog.message,
        onConfirm: dialog.onConfirm,
        onClose: closeDialog,
      }}
    />
  );
});
