import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";

const OrderDetailModal = ({
  open,
  order,
  orderDetails,
  loadingDetails,
  updateDetail,
  deleteDetail,
  refetchDetails,
  onClose,
  showDialog,
}) => {
  const [editing, setEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [productDetailOptions, setProductDetailOptions] = useState([]);

  const { data: productDetails = [] } = useCRUDApi("product-details").useGetAll({
    include: ["product", "memory", "screen", "rear_camera", "front_camera", "operating_system"],
  });

  useEffect(() => {
    if (productDetails.length > 0) {
      setProductDetailOptions(
        productDetails.map((pd) => {
          const detailParts = [
            pd.memory?.name,
            pd.screen?.name,
            pd.rear_camera?.name,
            pd.front_camera?.name,
            pd.operating_system?.name,
          ].filter(Boolean);

          return {
            value: pd.id,
            label: `${pd.product?.name ?? "Sản phẩm"} - ${detailParts.join(" / ")}`,
            product_name: pd.product?.name ?? "",
            detail_info: detailParts.join(" / "),
          };
        })
      );
    }
  }, [productDetails]);

  // Hàm format tiền không hiển thị decimal và thêm VNĐ
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "—";
    return `${parseInt(amount).toLocaleString("vi-VN")} VNĐ`;
  };

  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-w-5xl p-4 md:p-8 relative md:max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="mb-4 md:mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Chi tiết đơn hàng
          </h2>
          <p className="text-base sm:text-lg text-blue-600 font-semibold mt-2">
            Mã đơn: {order.order_code}
          </p>
        </div>

        {/* TABLE */}
        {loadingDetails ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            <span className="ml-3 text-sm sm:text-base text-gray-600">Đang tải chi tiết...</span>
          </div>
        ) : orderDetails.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-lg text-gray-500">Không có chi tiết sản phẩm</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                  <th className="p-3">Sản phẩm</th>
                  <th className="p-3">Chi tiết</th>
                  <th className="p-3 text-center">SL</th>
                  <th className="p-3 text-right">Đơn giá</th>
                  <th className="p-3 text-right">Thành tiền</th>
                  <th className="p-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderDetails.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex w-8 h-8 bg-blue-100 rounded-lg items-center justify-center flex-shrink-0">
                          <span>{idx + 1}</span>
                        </div>
                        <span>{item.product_name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span>{item.detail_info || "—"}</span>
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(item.price_at_order)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.subtotal)}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => { setEditItem(item); setEditing(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() =>
                            showDialog("confirm", "Xác nhận", `Xóa sản phẩm "${item.product_name}" khỏi đơn hàng?`, async () => {
                              await deleteDetail.mutateAsync(item.id);
                              refetchDetails();
                            })
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM SỬA */}
        {editing && editItem && (
          <div className="mt-6">
            <DynamicForm
              title={`Sửa chi tiết: ${editItem.product_name}`}
              fields={[
                { name: "product_detail_id", label: "Chọn phiên bản sản phẩm", type: "select", options: productDetailOptions, required: true },
                { name: "quantity", label: "Số lượng", type: "number", required: true },
                { name: "price_at_order", label: "Đơn giá", type: "number", required: true },
                { name: "subtotal", label: "Thành tiền", type: "number", required: true },
              ]}
              initialData={editItem}
              onSave={async (data) => {
                const selected = productDetailOptions.find((opt) => opt.value === data.product_detail_id);
                await updateDetail.mutateAsync({ 
                  id: editItem.id, 
                  data: { 
                    ...data, 
                    product_name: selected?.product_name, 
                    detail_info: selected?.detail_info 
                  } 
                });
                refetchDetails();
                setEditing(false);
              }}
              onClose={() => setEditing(false)}
            />
          </div>
        )}

        <div className="mt-4 md:mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;