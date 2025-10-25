import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../../api/product/products";
import { useBrands } from "../../../../api/brand";

export default memo(function AdminProductPage() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const { data: products = [], isLoading, refetch } = useProducts();
  const { data: brands = [] } = useBrands();

  /** ==========================
   * 2. CRUD MUTATIONS
   * ========================== */
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "products"
  );

  /** ==========================
   * 3. HANDLER + DIALOG
   * ========================== */
  const { dialog, closeDialog, handleSave, handleDelete } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  /** ==========================
   * 4. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const mappedItems = useMemo(() => {
    return filteredItems.map((p) => ({
      ...p,
      brand_name: p.brand?.name || "Không rõ",
      status_val: Number(p.status), // 1 hoặc 0
    }));
  }, [filteredItems]);

  /** ==========================
   * 5. UI
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý sản phẩm</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm sản phẩm
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
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
              { field: "name", label: "Tên sản phẩm" },
              { field: "brand_name", label: "Thương hiệu" },
              { field: "description", label: "Mô tả" },
              {
                field: "status_val",
                label: "Trạng thái",
                render: (val) => (
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      val === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {val === 1 ? "Đang bán" : "Ngừng bán"}
                  </span>
                ),
              },
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
          title={crud.mode === "edit" ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          fields={[
            {
              name: "name",
              label: "Tên sản phẩm",
              type: "text",
              required: true,
            },
            {
              name: "brand_id",
              label: "Thương hiệu",
              type: "select",
              options: brands.map((b) => ({
                label: b.name,
                value: Number(b.id),
              })),
              required: true,
            },
            {
              name: "description",
              label: "Mô tả",
              type: "textarea",
            },
            {
              name: "status",
              label: "Trạng thái",
              type: "select",
              options: [
                { label: "Đang bán", value: 1 },
                { label: "Ngừng bán", value: 0 },
              ],
            },
          ]}
          // FIX: map brand_id và status từ selectedItem
          initialData={
            crud.selectedItem
              ? {
                  ...crud.selectedItem,
                  brand_id: crud.selectedItem.brand?.id
                    ? Number(crud.selectedItem.brand.id)
                    : undefined,
                  status:
                    crud.selectedItem.status !== undefined
                      ? Number(crud.selectedItem.status)
                      : 1, // default trạng thái
                }
              : {}
          }
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
