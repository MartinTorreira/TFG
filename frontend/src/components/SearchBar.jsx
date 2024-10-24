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
      className="p-3 w-full text-lg font-semibold border border-gray-800 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder-gray-500 focus:placeholder-opacity-0 placeholder-opacity-100  placeholder:italic placeholder:font-light placeholder:before:absolute placeholder:before:inset-0 placeholder:before:animate-typewriter placeholder:before:bg-white"
    />
  );
};

export default SearchBar;
