import React from "react";

export const InputProfile = ({ label, type, value, onChange, placeholder, required, error }) => {
  return (
    <div className="flex flex-col mb-4">
      <label
        className="block text font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type={type}
        className={`bg-gray-200 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 placeholder:italic placeholder:text-gray-600 font-semibold`}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        value={value}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
