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

  // Lấy danh sách product-details
  const { useGetAll: useGetProductDetails } = useCRUDApi("product-details");
  const { data: productDetails = [], isLoading: loadingProducts } = useGetProductDetails({
    include: ["product", "memory", "screen", "rear_camera", "front_camera", "operating_system"],
  });

  // Chuyển productDetails thành dropdown options
  useEffect(() => {
    if (productDetails.length > 0) {
      setProductDetailOptions(
        productDetails.map((pd) => {
          // Tạo chuỗi detail_info từ các relation
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

        {/* TABLE SECTION */}
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
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-800">
                    Sản phẩm
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-gray-800">
                    Chi tiết
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center font-bold text-gray-800">
                    SL
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right font-bold text-gray-800">
                    Đơn giá
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right font-bold text-gray-800">
                    Thành tiền
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center font-bold text-gray-800">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderDetails.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex w-8 h-8 bg-blue-100 rounded-lg items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm text-blue-600 font-bold">
                            {idx + 1}
                          </span>
                        </div>
                        <span className="truncate">{item.product_name}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">
                      <span className="inline-block bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium truncate">
                        {item.detail_info || "—"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-900 text-xs sm:text-sm">
                      {item.price_at_order.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="font-bold text-blue-600 text-xs sm:text-base">
                        {item.subtotal.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <button
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:scale-110 transition-all"
                          title="Sửa"
                          onClick={() => {
                            setEditItem(item);
                            setEditing(true);
                          }}
                        >
                          <FaEdit size={14} className="sm:hidden" />
                          <FaEdit size={16} className="hidden sm:block" />
                        </button>
                        <button
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:scale-110 transition-all"
                          title="Xóa"
                          onClick={() =>
                            showDialog(
                              "confirm",
                              "Xác nhận",
                              `Xóa sản phẩm "${item.product_name}" khỏi đơn hàng?`,
                              async () => {
                                try {
                                  await deleteDetail.mutateAsync(item.id);
                                  refetchDetails();
                                } catch {
                                  alert("Xóa thất bại");
                                }
                              }
                            )
                          }
                        >
                          <FaTrash size={14} className="sm:hidden" />
                          <FaTrash size={16} className="hidden sm:block" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM MODAL */}
        {editing && editItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-4 sm:pt-8 md:pt-10 z-50 overflow-y-auto p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl sm:max-w-3xl my-4">
              <DynamicForm
                title={`Sửa chi tiết: ${editItem.product_name}`}
                fields={[
                  {
                    name: "product_detail_id",
                    label: "Chọn phiên bản sản phẩm",
                    type: "select",
                    options: productDetailOptions,
                    required: true,
                  },
                  { name: "quantity", label: "Số lượng", type: "number", required: true },
                  { name: "price_at_order", label: "Đơn giá", type: "number", required: true },
                  { name: "subtotal", label: "Thành tiền", type: "number", required: true },
                ]}
                initialData={editItem}
                onSave={async (data) => {
                  try {
                    const selected = productDetailOptions.find(
                      (opt) => opt.value === data.product_detail_id
                    );
                    const payload = {
                      ...data,
                      product_name: selected?.product_name ?? editItem.product_name,
                      detail_info: selected?.detail_info ?? editItem.detail_info,
                    };
                    await updateDetail.mutateAsync({ id: editItem.id, data: payload });
                    refetchDetails();
                    setEditing(false);
                  } catch {
                    alert("Cập nhật thất bại");
                  }
                }}
                onClose={() => setEditing(false)}
              />
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-4 md:mt-6 flex justify-end">
          <button
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm sm:text-base rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;