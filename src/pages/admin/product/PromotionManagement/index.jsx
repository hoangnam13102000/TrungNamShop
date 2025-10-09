import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import DynamicForm from "../../../../components/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";

export default function PromotionList() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "Khuyến mãi mùa hè 2024",
      startDate: "2024-06-01",
      endDate: "2024-08-30",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingPromo, setEditingPromo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPromos = promotions.filter((promo) =>
    promo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (promoData) => {
    if (promoData.id) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === promoData.id ? promoData : p))
      );
    } else {
      setPromotions((prev) => [
        ...prev,
        { ...promoData, id: Date.now() },
      ]);
    }
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khuyến mãi này không?")) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAdd = () => {
    setEditingPromo(null);
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
          <FaPlus /> Thêm khuyến mãi
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table - Using AdminListTable */}
      <AdminListTable
        columns={[
          { field: "name", label: "Tên khuyến mãi" },
          { field: "startDate", label: "Ngày bắt đầu" },
          { field: "endDate", label: "Ngày kết thúc" },
        ]}
        data={filteredPromos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        imageFields={[]}
      />

      {/* Dynamic Form */}
      {isModalOpen && (
        <DynamicForm
          title={editingPromo ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
          fields={[
            {
              name: "name",
              label: "Tên khuyến mãi",
              type: "text",
              required: true,
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
          initialData={editingPromo}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}