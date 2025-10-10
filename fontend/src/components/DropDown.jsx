import { useState } from "react";

const Dropdown = ({ label, options = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="relative inline-block w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-red-400  px-4 py-2 text-left shadow-sm hover:border-blue-400 focus:outline-none flex justify-between items-center"
      >
        {selected ? selected.label : label}
        <span className="ml-2">&#9662;</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
