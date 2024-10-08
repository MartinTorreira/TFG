import React from "react";
import { useProductStore } from "./store/useProductStore";

const SearchBar = () => {
  const setQuery = useProductStore((state) => state.setFilteredQuery);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Buscar productos..."
      onChange={handleInputChange}
      className="p-3 w-full text-lg font-semibold border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:italic placeholder:font-light"
    />
  );
};

export default SearchBar;
