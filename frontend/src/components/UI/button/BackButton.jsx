import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ onClick, label = "Quay lại", className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-gray-700 mb-4 hover:text-gray-900 transition-colors ${className}`}
    >
      <FaArrowLeft />
      <span>{label}</span>
    </button>
  );
}
