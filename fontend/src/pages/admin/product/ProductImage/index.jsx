import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import useAdminCrud from "../../../../utils/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import placeholder from "../../../../assets/admin/logoicon1.jpg";

import {
  useProductImages,
  useCreateProductImage,
  useUpdateProductImage,
  useDeleteProductImage,
} from "../../../../api/product/productImage";
import { getImageUrl } from "../../../../utils/getImageUrl";
import { useColors } from "../../../../api/product/color";
import { useProducts } from "../../../../api/product/products";

export default memo(function ProductImageManagement() {
  /** ==========================
   * 1. FETCH DATA
   * ========================== */
  const { data: images = [], isLoading, refetch } = useProductImages();
  const { data: colors = [] } = useColors();
  const { data: products = [] } = useProducts();

  const colorOptions = colors.map((c) => ({ label: c.name, value: c.id }));
  const productOptions = products.map((p) => ({ label: p.name, value: p.id }));

  /** ==========================
   * 2. CRUD MUTATIONS
   * ========================== */
  const createMutation = useCreateProductImage();
  const updateMutation = useUpdateProductImage();
  const deleteMutation = useDeleteProductImage();

  const crud = useAdminCrud(
    {
      create: async (fd) => await createMutation.mutateAsync(fd),
      update: async (id, fd) => await updateMutation.mutateAsync({ id, data: fd }),
      delete: async (id) => await deleteMutation.mutateAsync({ id }),
    },
    "product_images"
  );

  /** ==========================
   * 3. ADMIN HANDLER
   * ========================== */
  const { dialog, closeDialog, handleSave: handleSaveAdmin, handleDelete: handleDeleteAdmin } =
    useAdminHandler(crud, refetch);

  /** ==========================
   * 4. STATE
   * ========================== */
  const [search, setSearch] = useState("");

  /** ==========================
   * 5. FILTER DATA
   * ========================== */
  const filteredItems = useMemo(() => {
    return images.filter((img) =>
      (img.product?.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [images, search]);

  /** ==========================
   * 6. HANDLERS
   * ========================== */
  const handleSave = async (formData) => {
    await handleSaveAdmin(formData);
  };

  const handleDelete = (item) => {
    handleDeleteAdmin(item, "id");
  };

  /** ==========================
   * 7. UI RENDER
   * ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-center">Quản lý ảnh sản phẩm</h1>

      {/* BUTTON + SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
        >
          <FaPlus /> Thêm ảnh
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
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-x-auto">
          <AdminListTable
            columns={[
              { field: "product.name", label: "Sản phẩm" },
              { field: "color.name", label: "Màu sắc" },
              {
                field: "image_path",
                label: "Hình ảnh",
                render: (value) => {
                  const imgUrl = getImageUrl(value);
                  return (
                    <div className="flex justify-center">
                      <img
                        src={imgUrl}
                        alt="product"
                        className="w-16 h-16 object-contain rounded border"
                        onError={(e) => {
                          if (e.target.src !== placeholder) e.target.src = placeholder;
                        }}
                      />
                    </div>
                  );
                },
              },
              {
                field: "is_primary",
                label: "Ảnh chính",
                render: (v) => (
                  <div className="flex justify-center">
                    {v ? (
                      <FaCheckCircle className="text-green-600 text-xl" />
                    ) : (
                      <FaTimesCircle className="text-red-400 text-xl" />
                    )}
                  </div>
                ),
              },
            ]}
            data={filteredItems}
            actions={[
              { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
              { icon: <FaTrash />, label: "Xoá", onClick: handleDelete },
            ]}
          />
        </div>
      )}

      {/* FORM: EDIT / CREATE */}
      {crud.openForm && (
        <DynamicForm
          title={
            crud.mode === "edit"
              ? `Chỉnh sửa ảnh - ${crud.selectedItem?.product?.name}`
              : "Thêm ảnh sản phẩm"
          }
          fields={[
            {
              name: "product_id",
              label: "Sản phẩm",
              type: "select",
              options: productOptions,
              required: true,
            },
            {
              name: "color_id",
              label: "Màu sắc",
              type: "select",
              options: colorOptions,
              required: false,
            },
            {
              name: "image",
              label: "Hình ảnh",
              type: "file",
              required: crud.mode === "create",
            },
            { name: "is_primary", label: "Ảnh chính", type: "checkbox" },
          ]}
          initialData={crud.selectedItem}
          onSave={handleSave}
          onClose={crud.handleCloseForm}
          mode={crud.mode}
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
