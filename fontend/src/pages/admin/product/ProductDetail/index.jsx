import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/ProductDetailForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import ProductDetailViewModal from "../../../../components/product/ProductDetailView";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import { getImageUrl } from "../../../../utils/getImageUrl";

import {
  useProductDetails,
  useCreateProductDetail,
  useUpdateProductDetail,
  useDeleteProductDetail,
} from "../../../../api/product/productDetail";

import {
  useProducts,
  useScreens,
  useFrontCameras,
  useRearCameras,
  useMemories,
  useOperatingSystems,
  useUtilities,
  useBatteriesCharging,
  useCommunicationConnectivities,
  useGeneralInformations,
} from "../../../../api/product/hooks";

export default memo(function AdminProductDetailPage() {
  /** ==========================
   *  1 FETCH DATA
   * ========================== */
  const { data: details = [], isLoading, refetch } = useProductDetails();
  const { data: products = [] } = useProducts();
  const { data: screens = [] } = useScreens();
  const { data: frontCameras = [] } = useFrontCameras();
  const { data: rearCameras = [] } = useRearCameras();
  const { data: memories = [] } = useMemories();
  const { data: operatingSystems = [] } = useOperatingSystems();
  const { data: utilities = [] } = useUtilities();
  const { data: batteries = [] } = useBatteriesCharging();
  const { data: connectivities = [] } = useCommunicationConnectivities();
  const { data: generalInfos = [] } = useGeneralInformations();

  /** ==========================
   *  2 CRUD SETUP
   * ========================== */
  const createMutation = useCreateProductDetail();
  const updateMutation = useUpdateProductDetail();
  const deleteMutation = useDeleteProductDetail();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      delete: deleteMutation.mutateAsync,
    },
    "product-details"
  );

  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.product?.name || `Chi tiết #${item?.id}`
  );

  const isMutating =
    createMutation.isLoading ||
    updateMutation.isLoading ||
    deleteMutation.isLoading;

  /** ==========================
   *  3 SEARCH & FILTER
   * ========================== */
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  const mappedItems = useMemo(() => {
    return details
      .filter((d) =>
        d.product?.name?.toLowerCase().includes(search.toLowerCase())
      )
      .map((d) => ({
        ...d,
        product_name: d.product?.name || "-",
        product_image: getImageUrl(d.product?.primary_image?.image_path),
        price_label:
          (d.price ? parseFloat(d.price).toLocaleString("vi-VN") : "0") + " ₫",
        stock_quantity: d.stock_quantity ?? 0,
      }));
  }, [details, search]);

  /** ==========================
   *  4 FORM FIELDS
   * ========================== */
  const formFields = useMemo(
    () => [
      {
        section: "Thông tin chung",
        fields: [
          {
            name: "product_id",
            label: "Sản phẩm",
            type: "select",
            required: true,
            options: products.map((p) => ({ label: p.name, value: p.id })),
          },
          {
            name: "general_information_id",
            label: "Thông tin chung (General)",
            type: "select",
            options: generalInfos.map((g) => ({
              label: g.design || g.material || `General #${g.id}`,
              value: g.id,
            })),
          },
        ],
      },
      {
        section: "Màn hình",
        fields: [
          {
            name: "screen_id",
            label: "Màn hình",
            type: "select",
            options: screens.map((s) => ({
              label:
                s.display_technology ||
                `${s.screen_size || ""} ${s.resolution || ""}`.trim(),
              value: s.id,
            })),
          },
        ],
      },
      {
        section: "Camera",
        fields: [
          {
            name: "rear_camera_id",
            label: "Camera sau",
            type: "select",
            options: rearCameras.map((c) => ({
              label: c.features || c.resolution || `Rear #${c.id}`,
              value: c.id,
            })),
          },
          {
            name: "front_camera_id",
            label: "Camera trước",
            type: "select",
            options: frontCameras.map((c) => ({
              label: c.features || c.resolution || `Front #${c.id}`,
              value: c.id,
            })),
          },
        ],
      },
      {
        section: "Bộ nhớ",
        fields: [
          {
            name: "memory_id",
            label: "Bộ nhớ (RAM / ROM)",
            type: "select",
            options: memories.map((m) => ({
              label:
                (m.ram ? `${m.ram}` : "") +
                (m.internal_storage ? ` / ${m.internal_storage}` : ""),
              value: m.id,
            })),
          },
        ],
      },
      {
        section: "Pin & Hệ điều hành",
        fields: [
          {
            name: "operating_system_id",
            label: "Hệ điều hành",
            type: "select",
            options: operatingSystems.map((os) => ({
              label: os.name,
              value: os.id,
            })),
          },
          {
            name: "battery_id",
            label: "Pin / Sạc",
            type: "select",
            options: batteries.map((b) => ({
              label: b.battery_capacity
                ? `${b.battery_capacity}`
                : `Battery #${b.id}`,
              value: b.id,
            })),
          },
        ],
      },
      {
        section: "Tiện ích & Kết nối",
        fields: [
          {
            name: "utility_id",
            label: "Tiện ích",
            type: "select",
            options: utilities.map((u) => ({
              label: u.advanced_security || u.special_features || `#${u.id}`,
              value: u.id,
            })),
          },
          {
            name: "communication_id",
            label: "Kết nối & SIM",
            type: "select",
            options: connectivities.map((c) => ({
              label: c.sim_slot || `#${c.id}`,
              value: c.id,
            })),
          },
        ],
      },
      {
        section: "💰 Giá & Tồn kho",
        fields: [
          {
            name: "price",
            label: "Giá bán (₫)",
            type: "number",
            min: 0,
            step: 1000,
          },
          {
            name: "stock_quantity",
            label: "Số lượng tồn kho",
            type: "number",
            min: 0,
            step: 1,
          },
        ],
      },
    ],
    [
      products,
      screens,
      rearCameras,
      frontCameras,
      memories,
      operatingSystems,
      batteries,
      utilities,
      connectivities,
      generalInfos,
    ]
  );

  /** ==========================
   *  5 HANDLE INITIAL DATA (FIX)
   * ========================== */
  const selectedData =
    crud.mode === "edit" && crud.selectedItem
      ? {
          ...crud.selectedItem,
          product_id: crud.selectedItem.product?.id,
          general_information_id: crud.selectedItem.general_information?.id,
          screen_id: crud.selectedItem.screen?.id,
          rear_camera_id: crud.selectedItem.rear_camera?.id,
          front_camera_id: crud.selectedItem.front_camera?.id,
          memory_id: crud.selectedItem.memory?.id,
          operating_system_id: crud.selectedItem.operating_system?.id,
          battery_id: crud.selectedItem.battery?.id || null, // ✅ đúng key
          utility_id: crud.selectedItem.utility?.id,
          communication_id: crud.selectedItem.communication?.id || null, // ✅ đúng key
        }
      : crud.selectedItem || {};

  /** ==========================
   *  6 UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 Quản lý Chi Tiết Sản Phẩm</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700"
          disabled={isLoading || isMutating}
        >
          <FaPlus /> Thêm chi tiết
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full sm:w-80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
      </div>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
          <AdminListTable
            columns={[
              {
                field: "product_image",
                label: "Ảnh",
                render: (value) =>
                  value ? (
                    <img
                      src={value}
                      alt="Ảnh sản phẩm"
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Không có ảnh</span>
                  ),
              },
              { field: "product_name", label: "Sản phẩm" },
              { field: "price_label", label: "Giá bán" },
              { field: "stock_quantity", label: "Tồn kho" },
            ]}
            data={mappedItems}
            actions={[
              { icon: <FaEye />, label: "Xem", onClick: setViewItem },
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
            ]}
          />
        </div>
      )}

      {viewItem && (
        <ProductDetailViewModal
          item={viewItem}
          onClose={() => setViewItem(null)}
        />
      )}

      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? "✏️ Sửa chi tiết sản phẩm"
              : "➕ Thêm chi tiết sản phẩm mới"
          }
          fieldGroups={formFields}
          initialData={selectedData} // ✅ FIXED
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          isSaving={isMutating}
          className="w-full max-w-3xl mx-auto"
        />
      )}

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        isConfirming={isMutating}
      />
    </div>
  );
});
