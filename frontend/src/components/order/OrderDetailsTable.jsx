import { memo } from "react";
import { getImageUrl } from "../../utils/helpers/getImageUrl";
import { FaList } from "react-icons/fa";

const OrderDetailsTable = ({ orderDetails = [], formatCurrency = (amount) => amount?.toLocaleString("vi-VN") }) => {
  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">Không có chi tiết sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FaList className="text-blue-600" /> Chi tiết đơn hàng ({orderDetails.length} sản phẩm)
      </h3>
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Số lượng</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Đơn giá</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orderDetails.map((detail, idx) => {
                const productDetail = detail.product_detail || {};
                const product = productDetail.product || {};
                const productName = detail.product_name || product.name || "—";
                const memory = productDetail.memory || "—";
                const productId = product.product_id || product.id || "—";
                const thumbnail = getImageUrl(
                  product.images?.find((img) => img.is_primary)?.image_path
                );
                const quantity = detail.quantity || 0;
                const price = Number(detail.price_at_order) || 0;
                const total = price * quantity;

                return (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 shadow-sm">
                          <img src={thumbnail} alt={productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm leading-5">{productName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-2">
                              Mã sản phẩm: {productId}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              Bộ nhớ: {memory}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-semibold text-gray-900 text-sm">
                        {quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(price)}</p>
                      <p className="text-xs text-gray-500">VNĐ</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-blue-600">{formatCurrency(total)}</p>
                      <p className="text-xs text-gray-500">VNĐ</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderDetailsTable);
