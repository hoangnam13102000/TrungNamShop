import { memo } from "react";
import AdminListTable from "../AdminListTable";
import Pagination from "../Pagination";
import DynamicForm from "../../formAndDialog/DynamicForm";
import DynamicDialog from "../../formAndDialog/DynamicDialog";

const AdminLayoutPage = ({
  title,
  description,
  searchValue,
  onSearchChange,
  onAdd,
  tableColumns = [],
  tableData = [],
  tableActions = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  formModal = {
    open: false,
    title: "",
    fields: [],
    initialData: {},
    errors: {},
  },
  onFormSave = () => {},
  onFormClose = () => {},
  dialogProps = {
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
    onClose: () => {},
  },
}) => {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {/* SEARCH + ADD */}
      <div className="mb-4 md:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="text"
            placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
            value={searchValue}
            onChange={onSearchChange}
            className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm whitespace-nowrap"
            >
              + Thêm
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {tableData.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            <p className="text-sm sm:text-base">Không có dữ liệu</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <AdminListTable
                columns={tableColumns}
                data={tableData}
                actions={tableActions}
              />
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="px-3 sm:px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  maxVisible={5}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* FORM MODAL */}
      {formModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-4 sm:pt-8 md:pt-10 z-50 overflow-y-auto p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl sm:max-w-3xl my-4">
            <DynamicForm
              title={formModal.title}
              fields={formModal.fields}
              initialData={formModal.initialData}
              errors={formModal.errors}
              onSave={onFormSave}
              onClose={onFormClose}
            />
          </div>
        </div>
      )}

      {/* DIALOG */}
      <DynamicDialog {...dialogProps} />
    </div>
  );
};

export default memo(AdminLayoutPage);
