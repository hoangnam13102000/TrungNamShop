import { memo, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaEye, FaUser, FaCalendar, FaMoneyBillWave, FaGift, FaHandHoldingUsd, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import AdminListTable from "../../../../components/common/AdminListTable";
import DynamicForm from "../../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../../components/formAndDialog/DynamicDialog";
import CommonViewDialog from "../../../../components/users/CommonViewDialog";
import Pagination from "../../../../components/common/Pagination";
import useAdminCrud from "../../../../utils/hooks/useAdminCrud1";
import useAdminHandler from "../../../../components/common/useAdminHandler";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

const AttendanceManagement = () => {
  /** ========================== 1. FETCH DATA ========================== */
  const attendanceAPI = useCRUDApi("attendances");
  const employeeAPI = useCRUDApi("employees");
  const salaryAPI = useCRUDApi("salary-coefficients");
  const allowanceAPI = useCRUDApi("allowances");
  const rewardAPI = useCRUDApi("rewards");

  const { data: attendances = [], refetch: refetchAttendances } = attendanceAPI.useGetAll();
  const { data: employees = [] } = employeeAPI.useGetAll();
  const { data: salaryCoefficients = [] } = salaryAPI.useGetAll();
  const { data: allowances = [] } = allowanceAPI.useGetAll();
  const { data: rewards = [] } = rewardAPI.useGetAll();

  const create = attendanceAPI.useCreate();
  const update = attendanceAPI.useUpdate();
  const remove = attendanceAPI.useDelete();

  /** ========================== 2. CRUD ========================== */
  const crud = useAdminCrud(
    {
      create: create.mutateAsync,
      update: async (id, data) => update.mutateAsync({ id, data }),
      delete: async (id) => remove.mutateAsync(id),
    },
    "attendances"
  );

  const { dialog, handleSave, closeDialog } = useAdminHandler(crud, refetchAttendances);

  /** ========================== 3. STATE ========================== */
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /** ========================== 4. FILTER & PAGINATION ========================== */
  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();
    return attendances.filter((a) => {
      const employeeName = a.employee?.full_name?.toLowerCase() || "";
      return (
        employeeName.includes(term) ||
        String(a.work_days ?? "").includes(term) ||
        String(a.advance_payment ?? "").includes(term)
      );
    });
  }, [attendances, search]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredItems]);

  /** ========================== 5. CALCULATE FINAL SALARY ========================== */
  const enrichedItems = useMemo(() => {
    return currentItems.map((a) => {
      const baseSalary = Number(a.employee?.position?.base_salary ?? 0);
      const coefficient = Number(a.salary_coefficient?.coefficient_value ?? 1);
      const workingDays = Number(a.work_days ?? 0);
      const standardDays = 26;

      const allowance = Number(a.allowance?.allowance_amount ?? 0);
      const reward = Number(a.reward?.reward_money ?? 0);
      const advance = Number(a.advance_payment ?? 0);

      const finalSalary = Math.max(
        0,
        Math.round(
          baseSalary * coefficient * (workingDays / standardDays) +
            allowance +
            reward -
            advance
        )
      );

      return { ...a, final_salary: finalSalary };
    });
  }, [currentItems]);

  /** ========================== 6. UI ========================== */
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Quản lý chấm công</h1>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <button
          onClick={crud.handleAdd}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
        >
          <FaPlus /> Thêm chấm công
        </button>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm theo tên nhân viên, số ngày làm việc..."
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </div>

      {/* TABLE */}
      <AdminListTable
        columns={[
          { field: "employee.full_name", label: "Nhân viên" },
          {
            field: "allowance",
            label: "Phụ cấp",
            render: (a) =>
              a ? `${a.allowance_name} (${Number(a.allowance_amount ?? 0).toLocaleString()} VNĐ)` : "0 VNĐ",
          },
          {
            field: "reward",
            label: "Thưởng",
            render: (r) =>
              r ? `${r.reward_name} (${Number(r.reward_money ?? 0).toLocaleString()} VNĐ)` : "0 VNĐ",
          },
          {
            field: "final_salary",
            label: "Lương thực nhận",
            render: (v) => (v != null ? Number(v).toLocaleString() + " VNĐ" : "0 VNĐ"),
          },
          { field: "work_days", label: "Số ngày làm việc" },
          {
            field: "advance_payment",
            label: "Ứng trước",
            render: (v) => (v != null ? Number(v).toLocaleString() + " VNĐ" : "0 VNĐ"),
          },
        ]}
        data={enrichedItems}
        actions={[
          { icon: <FaEye />, label: "Xem", onClick: setViewItem },
          { icon: <FaEdit />, label: "Sửa", onClick: crud.handleEdit },
        ]}
      />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxVisible={5}
        />
      )}

      {/* FORM */}
      {crud.openForm && (
        <DynamicForm
          title={crud.mode === "edit" ? "Sửa chấm công" : "Thêm chấm công mới"}
          fields={[
            {
              name: "employee_id",
              label: "Nhân viên",
              type: "select",
              options: employees.map((e) => ({ label: e.full_name, value: e.id })),
              required: true,
            },
            {
              name: "salary_coefficient_id",
              label: "Hệ số lương",
              type: "select",
              options: salaryCoefficients.map((s) => ({
                label: `${s.coefficient_name} (${s.coefficient_value})`,
                value: s.id,
              })),
              required: true,
            },
            {
              name: "allowance_id",
              label: "Phụ cấp",
              type: "select",
              options: allowances.map((a) => ({ label: a.allowance_name, value: a.id })),
              required: false,
            },
            {
              name: "reward_id",
              label: "Thưởng",
              type: "select",
              options: rewards.map((r) => ({ label: r.reward_name, value: r.id })),
              required: false,
            },
            { name: "work_days", label: "Số ngày làm việc", type: "number", min: 0 },
            { name: "advance_payment", label: "Ứng trước", type: "number", min: 0 },
            { name: "month", label: "Tháng", type: "number", min: 1, max: 12 },
            { name: "year", label: "Năm", type: "number", min: 2000, max: 2100 },
          ]}
          initialData={{
            ...crud.selectedItem,
            employee_id: crud.selectedItem?.employee_id || null,
            salary_coefficient_id: crud.selectedItem?.salary_coefficient_id || null,
            allowance_id: crud.selectedItem?.allowance_id || null,
            reward_id: crud.selectedItem?.reward_id || null,
            work_days: crud.selectedItem?.work_days || 0,
            advance_payment: crud.selectedItem?.advance_payment || 0,
            month: crud.selectedItem?.month || new Date().getMonth() + 1,
            year: crud.selectedItem?.year || new Date().getFullYear(),
          }}
          onSave={(formData) => {
            const payload = {
              employee_id: Number(formData.employee_id),
              salary_coefficient_id: Number(formData.salary_coefficient_id),
              allowance_id: formData.allowance_id ? Number(formData.allowance_id) : null,
              reward_id: formData.reward_id ? Number(formData.reward_id) : null,
              work_days: Number(formData.work_days),
              advance_payment: formData.advance_payment ? Number(formData.advance_payment) : null,
              month: Number(formData.month),
              year: Number(formData.year),
            };
            handleSave(payload);
          }}
          onClose={crud.handleCloseForm}
        />
      )}

      {/* VIEW DIALOG */}
      {viewItem && (
        <CommonViewDialog
          title={`Chi tiết chấm công`}
          open={!!viewItem}
          onClose={() => setViewItem(null)}
          data={[
            { icon: <FaUser />, label: "Nhân viên", value: viewItem.employee?.full_name || "—" },
            { icon: <FaEdit />, label: "Chức vụ", value: viewItem.employee?.position?.name || "—" },
            { icon: <FaDollarSign />, label: "Hệ số lương", value: viewItem.salary_coefficient?.coefficient_value ?? "—" },
            { icon: <FaCalendar />, label: "Số ngày làm việc", value: viewItem.work_days },
            { icon: <FaMoneyBillWave />, label: "Phụ cấp", value: viewItem.allowance ? `${viewItem.allowance.allowance_name} (${Number(viewItem.allowance.allowance_amount ?? 0).toLocaleString()} VNĐ)` : "0 VNĐ" },
            { icon: <FaGift />, label: "Thưởng", value: viewItem.reward ? `${viewItem.reward.reward_name} (${Number(viewItem.reward.reward_money ?? 0).toLocaleString()} VNĐ)` : "0 VNĐ" },
            { icon: <FaHandHoldingUsd />, label: "Ứng trước", value: (viewItem.advance_payment ?? 0).toLocaleString() + " VNĐ" },
            { icon: <FaDollarSign />, label: "Lương thực nhận", value: (viewItem.final_salary ?? 0).toLocaleString() + " VNĐ" },
            { icon: <FaCalendarAlt />, label: "Tháng", value: viewItem.month },
            { icon: <FaCalendarAlt />, label: "Năm", value: viewItem.year },
            { icon: <FaCalendar />, label: "Ngày vào làm", value: viewItem.employee?.created_at ? new Date(viewItem.employee.created_at).toLocaleDateString() : "—" },
          ]}
        />
      )}

      {/* CONFIRM DIALOG */}
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
};

export default memo(AttendanceManagement);
