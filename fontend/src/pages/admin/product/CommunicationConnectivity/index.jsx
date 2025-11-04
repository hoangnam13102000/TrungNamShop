import { memo, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi"; 

export default memo(function AdminCommunicationConnectivityPage() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const connectivityApi = useCRUDApi("communication-connectivities"); 
  const { data: connectivities = [], isLoading, refetch } =
    connectivityApi.useGetAll();

  /** ==========================
   * 2. CRUD MUTATIONS
   * ========================== */
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

  /** ==========================
   * 3. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.mobile_network || "Không rõ"
  );

  /** ==========================
   * 4. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () =>
      connectivities.filter((c) =>
        (c.mobile_network || "")
          .toLowerCase()
          .includes(search.toLowerCase().trim())
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

  /** ==========================
   * 5. INITIAL DATA FOR FORM
   * ========================== */
  const initialData = useMemo(() => {
    if (!crud.selectedItem) return {};
    return {
      ...crud.selectedItem,
      nfc: crud.selectedItem.nfc ? "true" : "false", // string để select nhận diện
      mobile_network: crud.selectedItem.mobile_network || "",
      sim_slot: crud.selectedItem.sim_slot || "",
      gps: crud.selectedItem.gps || "",
    };
  }, [crud.selectedItem]);

  /** ==========================
   * 6. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">
        Quản lý Communication & Connectivities
      </h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm Communication & Connectivity
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo mạng..."
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
            data={mappedItems}
            actions={[
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
            ]}
          />
        </div>
      )}

      {/* FORM */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit" ? "Sửa Connectivity" : "Thêm Connectivity"
          }
          fields={[
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
          ]}
          initialData={initialData}
          onSave={(data) =>
            handleSave({
              ...data,
              nfc: data.nfc === "true", // convert string về boolean trước khi gửi
              mobile_network: data.mobile_network || "",
              sim_slot: data.sim_slot || "",
              gps: data.gps || "",
            })
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
