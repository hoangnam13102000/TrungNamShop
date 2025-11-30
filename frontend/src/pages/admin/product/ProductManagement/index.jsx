import { memo, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminLayoutPage from "../../../../components/common/Layout";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";

const AdminProductPage = () => {
  /** ==========================
   * 1. FETCH DATA & CRUD API
   * ========================== */
  const productApi = useCRUDApi("products");
  const brandApi = useCRUDApi("brands");

  const { data: products = [], isLoading, refetch } = productApi.useGetAll();
  const { data: brands = [] } = brandApi.useGetAll();

  const createMutation = productApi.useCreate();
  const updateMutation = productApi.useUpdate();
  const deleteMutation = productApi.useDelete();

  /** ==========================
   * 2. CRUD HANDLER
   * ========================== */
  const crud = useAdminCrud(
    {
      create: createMutation.mutateAsync,
      update: async (id, data) => updateMutation.mutateAsync({ id, data }),
      delete: async (id) => deleteMutation.mutateAsync(id),
    },
    "products"
  );

  const { dialog, handleSave, handleDelete, closeDialog } = useAdminHandler(
    crud,
    refetch,
    (item) => item?.name || "Không tên"
  );

  /** ==========================
   * 3. SEARCH & MAP DATA
   * ========================== */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredItems = useMemo(() => {
    return products.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const mappedItems = useMemo(() => {
    return filteredItems.map((p) => ({
      ...p,
      brand_name: p.brand?.name || "Không rõ",
      status_val: Number(p.status),
    }));
  }, [filteredItems]);

  const totalPages = Math.ceil(mappedItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return mappedItems.slice(start, start + itemsPerPage);
  }, [mappedItems, currentPage]);

  /** ==========================
   * 4. UI - Status Label
   * ========================== */
  const renderStatusLabel = (val) => {
    const isActive = val === 1;
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "600",
          color: isActive ? "#047857" : "#6b7280",
          backgroundColor: isActive ? "#d1fae5" : "#f3f4f6",
          border: `1.5px solid ${isActive ? "#6ee7b7" : "#d1d5db"}`,
          transition: "all 0.2s ease",
        }}
      >
        {isActive ? (
          <>
            <FaCheckCircle style={{ fontSize: "12px", color: "#10b981" }} />
            <span>Đang bán</span>
          </>
        ) : (
          <>
            <FaTimesCircle style={{ fontSize: "12px", color: "#9ca3af" }} />
            <span>Ngừng bán</span>
          </>
        )}
      </div>
    );
  };

  /** ==========================
   * Loading UI
   * ========================== */
  if (isLoading) {
    return <div className="p-4 text-gray-500">Đang tải dữ liệu...</div>;
  }

  /** ==========================
   * 5. UI via AdminLayoutPage
   * ========================== */
  return (
    <AdminLayoutPage
      title="Quản lý sản phẩm"
      searchValue={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      onAdd={crud.handleAdd}
      tableColumns={[
        { field: "name", label: "Tên sản phẩm" },
        { field: "brand_name", label: "Thương hiệu" },
        { field: "description", label: "Mô tả" },
        {
          field: "status_val",
          label: "Trạng thái",
          render: (val) => renderStatusLabel(val),
        },
      ]}
      tableData={paginatedItems}
      tableActions={[
        { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        { icon: <FaTrash />, label: "Xóa", onClick: handleDelete },
      ]}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      formModal={{
        open: crud.openForm,
        title: crud.mode === "edit" ? "Sửa sản phẩm" : "Thêm sản phẩm",
        fields: [
          { name: "name", label: "Tên sản phẩm", type: "text", required: true },
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
          { name: "description", label: "Mô tả", type: "textarea" },
          {
            name: "status",
            label: "Trạng thái",
            type: "select",
            options: [
              { label: "Đang bán", value: 1 },
              { label: "Ngừng bán", value: 0 },
            ],
          },
        ],
        initialData: crud.selectedItem
          ? {
              ...crud.selectedItem,
              brand_id: crud.selectedItem.brand?.id
                ? Number(crud.selectedItem.brand.id)
                : undefined,
              status:
                crud.selectedItem.status !== undefined
                  ? Number(crud.selectedItem.status)
                  : 1,
            }
          : {},
      }}
      onFormSave={handleSave}
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

export default memo(AdminProductPage);