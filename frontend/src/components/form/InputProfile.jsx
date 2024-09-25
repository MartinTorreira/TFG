import React, { useState } from "react";
import { EditIcon } from "../../icons/EditoIcon";

export const InputProfile = ({
  label,
  type = "text",
  onChange,
  placeholder,
  required,
  error,
  onButtonClick,
  icon,
  value,
  edit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleButtonClick = () => {
    setIsEditing(true);
    if (onButtonClick) {
      onButtonClick(value); // Pasa el valor actual al handler del botón
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="block text font-medium text-gray-900">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          className={`bg-gray-200 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2 pl-2 pr-10 placeholder:italic placeholder:text-gray-600 font-semibold w-full`}
          placeholder={isEditing || type === "password" ? "" : placeholder} // Cambia el placeholder según el estado de edición
          required={required}
          onChange={onChange}
          value={isEditing || type === "password" ? value : ""} // Si estamos editando o es un campo de contraseña, muestra el valor, de lo contrario, vacío
          onFocus={() => setIsEditing(true)} // Establece isEditing en true cuando se enfoca el input
          onBlur={() => setIsEditing(false)} // Establece isEditing en false cuando pierde el foco
          disabled={edit && !isEditing} // Deshabilita el input si no estamos editando
        />
        {icon && (
          <button
            type="button"
            onClick={handleButtonClick}
            className="absolute right-2 border border-gray-600 rounded-lg p-1 hover:opacity-90 transition"
          >
            <EditIcon size={24} color={"text-gray-800"} />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};