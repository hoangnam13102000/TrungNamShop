import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Dropdown = ({
  label = "Chọn",
  options = [],
  value,
  onSelect,
  className = "",
  buttonClassName = "",
  listClassName = "",
  placeholder = "Danh mục",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 selectedOption so khớp kiểu string
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  const handleSelect = (option) => {
    if (disabled) return;
    setIsOpen(false);
    onSelect?.(option);
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className || "w-full"}`}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`bg-white border border-gray-300 px-4 py-2 text-left shadow-sm flex justify-between items-center w-full
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "hover:border-blue-400"} ${buttonClassName}`}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder || label}
        </span>
        <span className="ml-2 text-gray-500">
          {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </span>
      </button>

      {isOpen && !disabled && (
        <ul
          className={`absolute left-0 z-50 bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto w-full ${listClassName}`}
        >
          {options.length > 0 ? (
            options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  String(value) === String(opt.value)
                    ? "bg-gray-100 font-medium"
                    : ""
                }`}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400 text-sm italic">
              Không có dữ liệu
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
