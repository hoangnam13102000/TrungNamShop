import { FiEdit2, FiShoppingCart, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; 
import DynamicForm from "../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import { useProfileLogic } from "../../../utils/profile/useProfileLogic";

export default function Profile() {
  const navigate = useNavigate(); // khởi tạo navigate
  const {
    isEditing,
    setIsEditing,
    isChangingPassword,
    setIsChangingPassword,
    dialog,
    profileData,
    isLoading,
    fields,
    passwordFields,
    handleSave,
    handleChangePassword,
  } = useProfileLogic();

  if (isLoading || !profileData) {
    return <div className="p-6 text-center text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden flex items-center justify-center bg-white border-2 border-gray-300 shadow-md">
                <img
                  src={profileData.avatarPreview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {profileData.full_name}
              </h1>
              <div className="space-y-2 mb-6">
                <p className="text-red-600 text-base font-medium">
                  {profileData.email}
                </p>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  {profileData.phone_number}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/don-hang-cua-toi")} 
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold shadow-sm"
                >
                  <FiShoppingCart size={18} /> Lịch sử mua hàng
                </button>
                {!isEditing && !isChangingPassword && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold shadow-sm"
                    >
                      <FiEdit2 size={18} /> Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-sm"
                    >
                      <FiLock size={18} /> Đổi mật khẩu
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form chỉnh sửa thông tin */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 mb-8">
            <DynamicForm
              title="Cập nhật thông tin cá nhân"
              fields={fields}
              initialData={profileData}
              onSave={handleSave}
              onClose={() => setIsEditing(false)}
            />
          </div>
        )}

        {/* Form đổi mật khẩu */}
        {isChangingPassword && (
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 mb-8">
            <DynamicForm
              title="Đổi mật khẩu"
              fields={passwordFields}
              initialData={{
                current_password: "",
                new_password: "",
                confirm_password: ""
              }}
              onSave={handleChangePassword}
              onClose={() => setIsChangingPassword(false)}
            />
          </div>
        )}

        {/* Thông tin hiển thị */}
        {!isEditing && !isChangingPassword && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields
              .filter((f) => f.name !== "avatar")
              .map((f) => (
                <div
                  key={f.name}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                    {f.label}
                  </p>
                  <p className="text-gray-900 text-base font-semibold">
                    {f.name === "birth_date" && profileData[f.name]
                      ? new Date(profileData[f.name]).toLocaleDateString("vi-VN")
                      : f.name === "gender" && profileData[f.name]
                      ? profileData[f.name] === "male"
                        ? "Nam"
                        : "Nữ"
                      : profileData[f.name] || "—"}
                  </p>
                </div>
              ))}

            {/* Hiển thị cấp độ thành viên */}
            {profileData.account?.member_level && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                  Cấp độ thành viên
                </p>
                <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {profileData.account.member_level}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Dialog confirm / success / error */}
        <DynamicDialog
          open={dialog.open}
          mode={dialog.mode}
          title={dialog.title}
          message={dialog.message}
          onClose={dialog.onClose}
          onConfirm={dialog.onConfirm}
        />
      </div>
    </div>
  );
}
