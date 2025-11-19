import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import placeholder from "../../../../assets/admin/logoicon1.jpg";
import { getImageUrl } from "../../../../utils/helpers/getImageUrl";

const ProductImageManagement = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const imageApi = useCRUDApi("product-images");
  const colorApi = useCRUDApi("colors");
  const productApi = useCRUDApi("products");

  const { data: images = [], refetch } = imageApi.useGetAll();
  const { data: colors = [] } = colorApi.useGetAll();
  const { data: products = [] } = productApi.useGetAll();

  const colorOptions = colors.map((c) => ({ label: c.name, value: c.id }));
  const productOptions = products.map((p) => ({ label: p.name, value: p.id }));

  const createMutation = imageApi.useCreate();
  const updateMutation = imageApi.useUpdate();
  const deleteMutation = imageApi.useDelete();

  /** ==========================
   * 2. HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: async (fd) => await createMutation.mutateAsync(fd),
      update: async (id, fd) => await updateMutation.mutateAsync({ id, data: fd }),
      delete: async (id) => await deleteMutation.mutateAsync({ id }),
    },
    "product_images"
  );

  const { dialog, handleSave: handleSaveAdmin, handleDelete: handleDeleteAdmin, closeDialog } =
    useAdminHandler(crud, refetch);

  /** ==========================
   * 3. SEARCH & PAGINATION
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    return images.filter((img) =>
      (img.product?.name || "").toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [images, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  /** ==========================
   * 4. UI via AdminLayoutPage
   * ========================== */
  return (
    <AdminLayoutPage
      title="Quản lý ảnh sản phẩm"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
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
                  onError={(e) => { if (e.target.src !== placeholder) e.target.src = placeholder; }}
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
              {v ? <FaCheckCircle className="text-green-600 text-xl" /> : <FaTimesCircle className="text-red-400 text-xl" />}
            </div>
          ),
        },
      ]}
      tableData={paginatedItems}
      tableActions={[
        { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        { icon: <FaTrash />, label: "Xóa", onClick: (item) => handleDeleteAdmin(item, "id") },
      ]}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      formModal={{
        open: crud.openForm,
        title: crud.mode === "edit"
          ? `Chỉnh sửa ảnh - ${crud.selectedItem?.product?.name || ""}`
          : "Thêm ảnh sản phẩm",
        fields: [
          { name: "product_id", label: "Sản phẩm", type: "select", options: productOptions, required: true },
          { name: "color_id", label: "Màu sắc", type: "select", options: colorOptions },
          { name: "image", label: "Hình ảnh", type: "file", required: crud.mode === "create" },
          { name: "is_primary", label: "Ảnh chính", type: "checkbox" },
        ],
        initialData: crud.selectedItem,
      }}
      onFormSave={handleSaveAdmin}
      onFormClose={crud.handleCloseForm}
      dialogProps={{
        open: dialog.open,
        mode: dialog.mode,
        title: dialog.title,
        message: dialog.message,
        onConfirm: dialog.onConfirm,
        onClose: closeDialog,
      }}
    />
  );
};

export default memo(ProductImageManagement);
