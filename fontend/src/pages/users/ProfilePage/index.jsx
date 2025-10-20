import { useState, useEffect } from "react";
import { FiEdit2, FiShoppingCart } from "react-icons/fi";
import DynamicForm from "../../../components/formAndDialog/DynamicForm";
import DynamicDialog from "../../../components/formAndDialog/DynamicDialog";
import {
  getCustomersAPI,
  updateCustomerAPI,
} from "../../../api/customer/request";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false }); 

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    birthday: "",
    gender: "",
    avatar: "",
  });

  //Fetch API 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCustomersAPI();
        setProfileData(data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin khách hàng:", error);
        setDialog({
          open: true,
          mode: "error",
          title: "Lỗi tải dữ liệu",
          message: "Không thể tải thông tin khách hàng. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fields = [
    { name: "full_name", label: "Họ và tên", type: "text", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "phone_number", label: "Số điện thoại", type: "text" },
    { name: "birthday", label: "Ngày sinh", type: "date" },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Khác", value: "other" },
      ],
    },
    { name: "address", label: "Địa chỉ", type: "textarea" },
    { name: "avatar", label: "Ảnh đại diện", type: "file" },
  ];

  // Save
  const handleSave = async (data) => {
    // Show Dialog
    setDialog({
      open: true,
      mode: "confirm",
      title: "Xác nhận cập nhật",
      message: `Bạn có chắc chắn muốn cập nhật thông tin của "${data.full_name}" không?`,
      onConfirm: async () => {
        try {
          const updated = await updateCustomerAPI(data);
          setProfileData(updated);
          setIsEditing(false);
          setDialog({
            open: true,
            mode: "success",
            title: "Cập nhật thành công",
            message: "Thông tin cá nhân của bạn đã được cập nhật!",
          });
        } catch (error) {
          console.error("Lỗi khi cập nhật:", error);
          setDialog({
            open: true,
            mode: "error",
            title: "Cập nhật thất bại",
            message: "Không thể cập nhật thông tin, vui lòng thử lại.",
          });
        }
      },
      onClose: () => setDialog({ open: false }),
    });
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold bg-gradient-to-br from-red-400 to-red-600 overflow-hidden">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              profileData.full_name?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {profileData.full_name}
            </h1>
            <p className="text-gray-600 mt-1">{profileData.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              {profileData.phone_number}
            </p>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
            >
              <FiShoppingCart /> Lịch sử mua hàng
            </button>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                <FiEdit2 /> Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        {/* Edit form */}
        {isEditing && (
          <DynamicForm
            title="Cập nhật thông tin"
            fields={fields}
            initialData={profileData}
            onSave={handleSave}
            onClose={() => setIsEditing(false)}
          />
        )}

        {/* Show profile info */}
        {!isEditing && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-4">
            {fields
              .filter((f) => f.name !== "avatar")
              .map((f) => (
                <div key={f.name}>
                  <p className="text-gray-500">{f.label}</p>
                  <p className="text-gray-800 font-medium">
                    {profileData[f.name] || "—"}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* Order history modal */}
        {showHistory && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setShowHistory(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-11/12 sm:w-[600px] p-6 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Lịch sử mua hàng</h2>
              <div className="max-h-96 overflow-y-auto">
                <ul className="divide-y">
                  <li className="py-2 flex justify-between">
                    <span>Đơn hàng #001</span>
                    <span>10/10/2025</span>
                  </li>
                  <li className="py-2 flex justify-between">
                    <span>Đơn hàng #002</span>
                    <span>12/10/2025</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/*  DynamicDialog */}
        <DynamicDialog {...dialog} />
      </div>
    </div>
  );
}
