import React from "react";

export const InputForm = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div>
      <label
        htmlFor="email"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type={type}
        name="email"
        className={`border-gray-300 bg-transparent border border-gray-400 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 placeholder:italic font-semibold`}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
