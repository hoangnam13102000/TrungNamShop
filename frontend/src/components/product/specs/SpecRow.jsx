import { memo } from "react";

// Chỉ export SpecRow, KHÔNG import SpecTab
const SpecRow = ({ label, value }) => (
  <div className="flex gap-4 py-3 px-4 border-b border-gray-100 last:border-b-0 hover:bg-blue-50/50 transition-colors">
    <span className="font-medium text-gray-700 min-w-32 text-sm sm:text-base">{label}:</span>
    <span className="text-gray-600 flex-1 text-sm sm:text-base">{String(value)}</span>
  </div>
);

export default memo(SpecRow);
