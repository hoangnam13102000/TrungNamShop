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
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setIsOpen(false);
    onSelect?.(option);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className} ${!className ? "w-full" : ""}`}
    >
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white border border-gray-300 px-4 py-2 text-left  shadow-sm flex justify-between items-center hover:border-blue-400 focus:outline-none w-full ${buttonClassName}`}
      >
        {selectedOption?.label || placeholder || label}
        <span className="ml-2">
          {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </span>
      </button>

      {/* Menu */}
      {isOpen && (
        <ul
          className={`absolute left-0 z-50 bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto w-full ${listClassName}`}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                value === opt.value ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
