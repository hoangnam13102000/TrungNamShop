import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";

export default function DiscountList() {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: "SUMMER2024",
      description: "Giảm 20% cho đơn hàng trên 1.000.000đ",
      discountPercent: 20,
      startDate: "2024-06-01",
      endDate: "2024-08-30",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter List
  const filteredDiscounts = discounts.filter((discount) =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Save
  const handleSave = (data) => {
    if (data.id) {
      setDiscounts((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
    } else {
      setDiscounts((prev) => [
        ...prev,
        { ...data, id: Date.now() },
      ]);
    }
    setIsModalOpen(false);
    setEditingDiscount(null);
  };

  // Chỉnh sửa
  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa mã giảm giá này không?")) {
      setDiscounts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Add New
  const handleAdd = () => {
    setEditingDiscount(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <button
          onClick={handleAdd}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <FaPlus /> Thêm mã giảm giá
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm mã giảm giá..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Bảng danh sách */}
      <AdminListTable
        columns={[
          { field: "code", label: "Mã giảm giá" },
          { field: "description", label: "Mô tả" },
          { field: "discountPercent", label: "Giảm (%)" },
          { field: "startDate", label: "Ngày bắt đầu" },
          { field: "endDate", label: "Ngày kết thúc" },
        ]}
        data={filteredDiscounts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        imageFields={[]}
      />

      {/* Form thêm/sửa */}
      {isModalOpen && (
        <DynamicForm
          title={editingDiscount ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
          fields={[
            {
              name: "code",
              label: "Mã giảm giá",
              type: "text",
              required: true,
            },
            {
              name: "description",
              label: "Mô tả",
              type: "textarea",
              required: true,
            },
            {
              name: "discountPercent",
              label: "Phần trăm giảm",
              type: "number",
              required: true,
              min: 1,
              max: 100,
            },
            {
              name: "startDate",
              label: "Ngày bắt đầu",
              type: "date",
              required: true,
            },
            {
              name: "endDate",
              label: "Ngày kết thúc",
              type: "date",
              required: true,
            },
          ]}
          initialData={editingDiscount}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
