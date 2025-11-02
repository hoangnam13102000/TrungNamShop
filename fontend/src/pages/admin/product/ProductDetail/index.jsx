import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import ProductDetailForm from "../../../../components/formAndDialog/ProductDetailForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import SpecModal from "../../../../components/product/specs/SpecModal";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { getImageUrl } from "../../../../utils/getImageUrl";
import { buildSpecs } from "../../../../utils/buildSpecs";
import { getProductDetailFormFields } from "../../../../utils/productDetails/useProductDetailFormFields";

import {
  useProductDetails,
  useCreateProductDetail,
  useUpdateProductDetail,
  // useDeleteProductDetail,
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

// // helper safeEntries
// const safeEntries = (obj) => (obj ? Object.entries(obj) : []);

export default memo(function AdminProductDetailPage() {
  // --- API data ---
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

  // --- Mutations ---
  const createMutation = useCreateProductDetail();
  const updateMutation = useUpdateProductDetail();
  // const deleteMutation = useDeleteProductDetail();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      // delete: deleteMutation.mutateAsync,
    },
    "product-details"
  );

  const { dialog, closeDialog, handleSave } = useAdminHandler(crud, refetch, (item) => item?.product?.name || `Chi tiết #${item?.id}`);
  const isMutating = createMutation.isLoading || updateMutation.isLoading ;

  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);

  // --- Map data cho table ---
  const mappedItems = useMemo(() => {
    return details
      .filter((d) => d.product?.name?.toLowerCase().includes(search.toLowerCase()))
      .map((d) => ({
        ...d,
        product_name: d.product?.name || "-",
        product_image: getImageUrl(d.product?.primary_image?.image_path),
        price_label: (d.price ? parseFloat(d.price).toLocaleString("vi-VN") : "0") + " VNĐ",
        stock_quantity: d.stock_quantity ?? 0,
      }));
  }, [details, search]);

  // --- Selected Data cho form edit ---
  const selectedData = useMemo(() => {
    if (crud.mode === "edit" && crud.selectedItem) {
      const item = crud.selectedItem;
      return {
        id: item.id,
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
        price: item.price ? parseFloat(item.price) : 0,
        stock_quantity: item.stock_quantity ?? 0,
      };
    }
    return {};
  }, [crud.mode, crud.selectedItem]);

  // --- Form Fields ---
  const formFields = useMemo(() => 
  getProductDetailFormFields({
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
  }), 
  [products, screens, rearCameras, frontCameras, memories, operatingSystems, batteries, utilities, connectivities, generalInfos]
);
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Quản lý Chi Tiết Sản Phẩm</h1>

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
                    <img src={value} alt="Ảnh sản phẩm" className="w-16 h-16 object-contain rounded-lg" />
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
              { icon: <FaEdit />, label: "Sửa", onClick: (item) => crud.handleEdit(item) },
              // { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
            ]}
          />
        </div>
      )}

      {viewItem && <SpecModal specs={buildSpecs(viewItem)} isOpen={!!viewItem} onClose={() => setViewItem(null)} />}

      {crud.openForm && (
        <ProductDetailForm
          title={crud.mode === "edit" ? "Sửa chi tiết sản phẩm" : "Thêm chi tiết sản phẩm mới"}
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
