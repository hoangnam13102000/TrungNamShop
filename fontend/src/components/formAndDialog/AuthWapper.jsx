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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 p-4 relative">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl relative z-10">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          {title}
        </h2>

        {/* Form content */}
        <div className="space-y-4">{children({ showAlert })}</div>

        {/* Navigation links */}
        <div className="text-center text-sm mt-6 text-gray-600">{navigateTo}</div>
      </div>

      {/* Popup alert */}
      {alert.show && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fade-in">
          <div
            className={`bg-white rounded-xl shadow-xl p-6 w-80 max-w-sm text-center border-t-4 animate-slide-up ${
              alert.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-2 ${
                alert.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {alert.type === "success" ? "Thành công" : "Thất bại"}
            </h3>
            <p className="text-gray-700 mb-4">{alert.message}</p>
            <button
              onClick={closeAlert}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
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

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
