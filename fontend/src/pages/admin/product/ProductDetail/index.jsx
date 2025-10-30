import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import ProductDetailForm from "../../../../components/formAndDialog/ProductDetailForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import ProductDetailViewModal from "../../../../components/product/ProductDetailView";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
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

  const safeEntries = (obj) => (obj ? Object.entries(obj) : []);

  const formFields = useMemo(() => [
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
          label: "Thông tin chung",
          type: "select",
          options: generalInfos.filter(Boolean).map((g) => ({
            label: Object.values(g)
              .filter((v) => v != null && v !== "")
              .join(" | "),
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
          options: screens.filter(Boolean).map((s) => ({
            label: safeEntries(s)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
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
          options: rearCameras.filter(Boolean).map((c) => ({
            label: safeEntries(c)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
            value: c.id,
          })),
        },
        {
          name: "front_camera_id",
          label: "Camera trước",
          type: "select",
          options: frontCameras.filter(Boolean).map((c) => ({
            label: safeEntries(c)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
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
          options: memories.filter(Boolean).map((m) => ({
            label: safeEntries(m)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
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
          options: operatingSystems.filter(Boolean).map((os) => ({
            label: safeEntries(os)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
            value: os.id,
          })),
        },
        {
          name: "battery_charging_id",
          label: "Pin / Sạc",
          type: "select",
          options: batteries.filter(Boolean).map((b) => ({
            label: safeEntries(b)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
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
          options: utilities.filter(Boolean).map((u) => ({
            label: safeEntries(u)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
            value: u.id,
          })),
        },
        {
          name: "communication_connectivity_id",
          label: "Kết nối & SIM",
          type: "select",
          options: connectivities.filter(Boolean).map((c) => ({
            label: safeEntries(c)
              .filter(([k]) => k !== "id")
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | "),
            value: c.id,
          })),
        },
      ],
    },
    {
      section: "💰 Giá & Tồn kho",
      fields: [
        { name: "price", label: "Giá bán (₫)", type: "number", min: 0, step: 1000 },
        { name: "stock_quantity", label: "Số lượng tồn kho", type: "number", min: 0, step: 1 },
      ],
    },
  ], [
    products, screens, rearCameras, frontCameras, memories, operatingSystems,
    batteries, utilities, connectivities, generalInfos
  ]);

  const selectedData = useMemo(() => {
    if (crud.mode === "edit" && crud.selectedItem) {
      const item = crud.selectedItem;
      return {
        product_id: item.product?.id ?? null,
        general_information_id: item.general_information?.id ?? null,
        screen_id: item.screen?.id ?? null,
        rear_camera_id: item.rear_camera?.id ?? null,
        front_camera_id: item.front_camera?.id ?? null,
        memory_id: item.memory?.id ?? null,
        operating_system_id: item.operating_system?.id ?? null,
        battery_charging_id: item.battery_charging?.id ?? null,
        utility_id: item.utility?.id ?? null,
        communication_connectivity_id: item.communication_connectivity?.id ?? null,
        price: item.price  ? parseFloat(item.price) : 0,
        stock_quantity: item.stock_quantity ?? 0,
      };
    } else if (crud.mode === "create") {
      return {
        product_id: null,
        general_information_id: null,
        screen_id: null,
        rear_camera_id: null,
        front_camera_id: null,
        memory_id: null,
        operating_system_id: null,
        battery_charging_id: null,
        utility_id: null,
        communication_connectivity_id: null,
        price: 0,
        stock_quantity: 0,
      };
    }
    return {};
  }, [crud.mode, crud.selectedItem]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 Quản lý Chi Tiết Sản Phẩm</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={() => crud.handleAdd()}
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
        <ProductDetailForm
          title={
            crud.mode === "edit"
              ? "Sửa chi tiết sản phẩm"
              : "Thêm chi tiết sản phẩm mới"
          }
          fieldGroups={formFields}
          initialData={selectedData}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          isSaving={isMutating}
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
