import React, { useState } from "react";

export const QuantitySelector = ({
  maxQuantity,
  initialQuantity,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="flex items-center">
      <span className="mr-2 font-bold">x</span>
      <input
        type="number"
        min="1"
        max={maxQuantity}
        value={quantity}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-16 p-1.5 placeholder:font-normal placeholder:italic appearance-none"
      />
    </div>
  );
};
