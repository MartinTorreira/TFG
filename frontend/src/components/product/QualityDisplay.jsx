import React, { useState } from "react";
import "./CategoryDisplay.css";
import { qualities } from "../../utils/Qualities";

export const QualityDisplay = ({ onQualitySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("--");

  const handleQualityClick = (quality) => {
    setSelectedQuality(quality.label);
    onQualitySelect(quality.value);
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block w-full"
      onClick={(e) => e.preventDefault()}
    >
      <button
        className="flex items-center justify-between bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedQuality}</span>
        <span>
          <svg
            className={`fill-current h-4 w-4 transform transition duration-150 ${isOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <ul
          className="absolute bg-white border rounded-lg shadow-lg mt-1 w-full z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {qualities.map((quality) => (
            <li
              key={quality.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleQualityClick(quality);
              }}
            >
              {quality.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
