import { useState, memo } from "react";
import { FaTimes } from "react-icons/fa";
import SpecTab from "./SpectTab";

const SpecModal = ({ specs, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 sm:px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Thông số kỹ thuật</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-20 bg-white border-b border-gray-200 px-4 sm:px-8 overflow-x-auto">
          <div className="flex gap-1 sm:gap-4">
            {specs.map((spec, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 sm:px-5 py-4 font-medium text-sm sm:text-base whitespace-nowrap transition-all border-b-2 ${
                  activeTab === idx
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{spec.icon}</span>
                {spec.category}
              </button>
            ))}
          </div>
        </div>

        {/* Nội dung */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <SpecTab spec={specs[activeTab]} />
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 px-6 sm:px-8 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(SpecModal);
