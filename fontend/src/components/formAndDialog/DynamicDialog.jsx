import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaQuestionCircle,
} from "react-icons/fa";

export default function DynamicDialog({
  open,
  mode = "confirm",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  closeText = "Đóng",
  customButtons,
}) {
  if (!open) return null;

  const iconMap = {
    success: <FaCheckCircle className="text-green-500 w-10 h-10" />,
    warning: <FaExclamationTriangle className="text-yellow-500 w-10 h-10" />,
    error: <FaTimesCircle className="text-red-500 w-10 h-10" />,
    alert: <FaInfoCircle className="text-blue-500 w-10 h-10" />,
    confirm: <FaQuestionCircle className="text-orange-500 w-10 h-10" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
        <div className="flex justify-center mb-3">{iconMap[mode]}</div>
        {title && <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>}
        {message && <div className="text-gray-600 mb-6 whitespace-pre-line">{message}</div>}

        <div className="flex justify-center gap-3">
          {customButtons ? (
            customButtons.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`px-4 py-2 rounded-lg transition ${btn.className || "bg-gray-200 hover:bg-gray-300"}`}
              >
                {btn.text}
              </button>
            ))
          ) : mode === "alert" || mode === "success" || mode === "error" ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {closeText}
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={async () => {
                  if (onConfirm) await onConfirm();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                {confirmText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
