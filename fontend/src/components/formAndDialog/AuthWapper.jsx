import { useState } from "react";

export default function AuthWrapper({ title, children, navigateTo }) {
  const [alert, setAlert] = useState({
    show: false,
    type: "success", // success | error
    message: "",
    onClose: null,
  });

  const showAlert = (type, message, onClose = null) => {
    setAlert({ show: true, type, message, onClose });
  };

  const closeAlert = () => {
    setAlert((prev) => {
      if (prev.onClose) prev.onClose();
      return { ...prev, show: false };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative z-10">
        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>

        {children({ showAlert })}

        <div className="text-center text-sm mt-4">{navigateTo}</div>
      </div>

      {/* Popup alert */}
      {alert.show && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white  rounded-lg shadow-lg p-6 w-80 text-center border-t-4 ${
              alert.type === "success"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-2 ${
                alert.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {alert.type === "success" ? "Thành công" : "Thất bại"}
            </h3>
            <p className="text-gray-700 mb-4">{alert.message}</p>
            <button
              onClick={closeAlert}
              className={`px-4 py-2 rounded-lg text-white ${
                alert.type === "success"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
