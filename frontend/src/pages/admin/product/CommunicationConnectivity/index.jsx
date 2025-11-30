import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

export default memo(function AdminCommunicationConnectivityPage() {
  const connectivityApi = useCRUDApi("communication-connectivities");
  const { data: connectivities = [], isLoading, refetch } = connectivityApi.useGetAll();

  const createMutation = connectivityApi.useCreate();
  const updateMutation = connectivityApi.useUpdate();
  const deleteMutation = connectivityApi.useDelete();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync({ id }),
    },
    "communication-connectivities"
  );

  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.mobile_network || "Không rõ"
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = useMemo(
    () =>
      connectivities.filter((c) =>
        (c.mobile_network || "").toLowerCase().includes(search.toLowerCase().trim())
      ),
    [connectivities, search]
  );

  const mappedItems = useMemo(
    () =>
      filteredItems.map((c) => ({
        ...c,
        nfc: !!c.nfc,
        sim_slot: c.sim_slot || "Không có",
        gps: c.gps || "Không rõ",
        mobile_network: c.mobile_network || "Không rõ",
      })),
    [filteredItems]
  );

  const totalPages = Math.ceil(mappedItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return mappedItems.slice(start, end);
  }, [mappedItems, currentPage]);

  const initialData = useMemo(() => {
    if (!crud.selectedItem) return {};
    return {
      ...crud.selectedItem,
      nfc: crud.selectedItem.nfc ? "true" : "false",
      mobile_network: crud.selectedItem.mobile_network || "",
      sim_slot: crud.selectedItem.sim_slot || "",
      gps: crud.selectedItem.gps || "",
    };
  }, [crud.selectedItem]);

  return (
    <AdminLayoutPage
      title="Quản lý Communication & Connectivities"
      isLoading={isLoading}
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        {
          field: "nfc",
          label: "Công nghệ NFC",
          render: (value) => (
            <div className="flex justify-center">
              {value ? (
                <FaCheckCircle className="text-green-500 text-lg" />
              ) : (
                <FaTimesCircle className="text-red-500 text-lg" />
              )}
            </div>
          ),
        },
        { field: "mobile_network", label: "Hỗ trợ mạng" },
        { field: "sim_slot", label: "Sim" },
        { field: "gps", label: "GPS" },
      ]}
      tableData={paginatedItems}
      tableActions={[
        { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
      ]}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      formModal={{
        open: crud.openForm,
        title: crud.mode === "edit" ? "Sửa Connectivity" : "Thêm Connectivity",
        fields: [
          {
            name: "nfc",
            label: "Công nghệ NFC",
            type: "select",
            options: [
              { label: "Có", value: "true" },
              { label: "Không", value: "false" },
            ],
          },
          { name: "mobile_network", label: "Hỗ trợ mạng", type: "text" },
          { name: "sim_slot", label: "Sim", type: "text" },
          { name: "gps", label: "GPS", type: "text" },
        ],
        initialData,
      }}
      onFormSave={(data) =>
        handleSave({
          ...data,
          nfc: data.nfc === "true",
          mobile_network: data.mobile_network || "",
          sim_slot: data.sim_slot || "",
          gps: data.gps || "",
        })
      }
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
