import useAdminCrud from "../../../../utils/useAdminCrud";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/DynamicForm";

const initialCustomers = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0918123456",
        email: "vana@example.com",
        address: "Quận 1, TP.HCM",
        status: "active",
    },
    {
        id: 2,
        name: "Trần Thị B",
        phone: "0987654321",
        email: "thib@example.com",
        address: "Quận 5, TP.HCM",
        status: "inactive",
    },
];

const statusLabels = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
};

export default function CustomerManagement() {
    const {
        filteredItems: customers,
        editingItem,
        showForm,
        search,
        setSearch,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSave,
        handleCloseModal,
    } = useAdminCrud(initialCustomers);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold mb-6"> Quản lý khách hàng</h1>

            {/* Tool Bar */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center mb-4 gap-3">
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                >
                    <FaPlus /> Thêm khách hàng
                </button>

                <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-red-500"
                />
            </div>

            {/* Customer Table */}
            <AdminListTable
                columns={[
                    { field: "name", label: "Họ tên" },
                    { field: "phone", label: "SĐT" },
                    { field: "email", label: "Email" },
                    { field: "address", label: "Địa chỉ" },
                    {
                        field: "status",
                        label: "Trạng thái",
                        render: (value) => (
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${value === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {statusLabels[value]}
                            </span>
                        ),
                    },
                ]}
                data={customers}
                actions={[
                    { icon: <FaEdit />, label: "Sửa", onClick: handleEdit },
                    { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
                ]}
            />

            {/* Form Add & Edit */}
            {showForm && (
                <DynamicForm
                    mode={editingItem ? "edit" : "add"}
                    title={
                        editingItem
                            ? ` Chỉnh sửa khách hàng - ${editingItem.name}`
                            : " Thêm khách hàng mới"
                    }
                    fields={[
                        { name: "name", label: "Họ tên", type: "text", required: true },
                        { name: "phone", label: "SĐT", type: "text", required: true },
                        { name: "email", label: "Email", type: "email", required: true },
                        { name: "address", label: "Địa chỉ", type: "text" },
                        {
                            name: "status",
                            label: "Trạng thái",
                            type: "select",
                            options: Object.keys(statusLabels).map((key) => ({
                                label: statusLabels[key],
                                value: key,
                            })),
                            required: true,
                        },
                    ]}
                    initialData={editingItem}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
