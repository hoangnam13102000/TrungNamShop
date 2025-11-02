import React, { memo } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";

const ProductDetailTable = ({
  mappedItems = [],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const actions = [
    { icon: <FaEye />, label: "Xem", onClick: onView },
    { icon: <FaEdit />, label: "Sửa", onClick: onEdit },
    { icon: <FaTrash />, label: "Xóa", onClick: onDelete },
  ];

  const columns = [
    {
      field: "product_image",
      label: "Ảnh",
      render: (value) =>
        value ? (
          <img src={value} alt="Ảnh sản phẩm" className="w-16 h-16 object-contain rounded-lg" />
        ) : (
          <span className="text-gray-400 italic">Không có ảnh</span>
        ),
    },
    { field: "product_name", label: "Sản phẩm" },
    { field: "price_label", label: "Giá bán" },
    { field: "stock_quantity", label: "Tồn kho" },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
      <AdminListTable columns={columns} data={mappedItems} actions={actions} />
    </div>
  );
};

export default memo(ProductDetailTable);
