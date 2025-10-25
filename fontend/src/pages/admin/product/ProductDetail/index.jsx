import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { getImageUrl } from "../../../../utils/getImageUrl";

// API hooks
import {
  useProductDetails,
  useCreateProductDetail,
  useUpdateProductDetail,
  useDeleteProductDetail,
} from "../../../../api/product/productDetail";

export default memo(function AdminProductDetailPage() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const { data: details = [], isLoading, refetch } = useProductDetails();

  /** ==========================
   * 2. CRUD MUTATIONS
   * ========================== */
  const crud = useAdminCrud(
    {
      create: useCreateProductDetail().mutateAsync,
      update: async (id, data) => useUpdateProductDetail().mutateAsync({ id, data }),
      delete: async (id) => useDeleteProductDetail().mutateAsync({ id }),
    },
    "product-details"
  );

  /** ==========================
   * 3. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.product?.name || `Chi tiết #${item?.id}`
  );

  /** ==========================
   * 4. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");

  const mappedItems = useMemo(() => {
    return details
      .filter((d) => d.product?.name?.toLowerCase().includes(search.toLowerCase()))
      .map((d) => {
        const priceInt = d.price ? parseInt(d.price) : 0;
        return {
          ...d,
          product_name: d.product?.name || "Không rõ",
          brand_name: d.product?.brand?.name || "Không rõ",
          color_name: d.color || "Không rõ",
          screen_name: d.screen?.display_technology || "Không rõ",
          memory_name: d.memory?.memory_card_slot || "Không rõ",
          utility_name: d.utility?.advanced_security || "Không rõ",
          price: priceInt,
          price_label: priceInt.toLocaleString("vi-VN") + " VNĐ",
          stock_quantity: d.stock_quantity ?? 0,
          image_url: getImageUrl(d.product?.primary_image?.image_path),
        };
      });
  }, [details, search]);

  /** ==========================
   * 5. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý chi tiết sản phẩm</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm chi tiết
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
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
                field: "image_url",
                label: "Ảnh",
                render: (url) => (
                  <img
                    src={url}
                    alt="product"
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                ),
              },
              { field: "product_name", label: "Sản phẩm" },
              { field: "brand_name", label: "Thương hiệu" },
              { field: "color_name", label: "Màu sắc" },
              { field: "screen_name", label: "Màn hình" },
              { field: "memory_name", label: "Bộ nhớ" },
              { field: "utility_name", label: "Tiện ích" },
              { field: "price_label", label: "Giá bán" },
              { field: "stock_quantity", label: "Tồn kho" },
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
          title={crud.mode === "edit" ? "Sửa chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}
          fields={[
            {
              name: "product_id",
              label: "Sản phẩm",
              type: "select",
              required: true,
              options: details.map((d) => ({
                label: d.product?.name || `Chi tiết #${d.id}`,
                value: d.product_id,
              })),
            },
            { name: "price", label: "Giá bán (₫)", type: "number", min: 0, step: 1, required: true },
            { name: "stock_quantity", label: "Tồn kho", type: "number", min: 0, step: 1 },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
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
