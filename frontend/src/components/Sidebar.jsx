import React, { useState, useEffect } from "react";
import { useCategoryStore } from "./store/useCategoryStore";
import { useProductStore } from "./store/useProductStore";
import { PriceSlider } from "./product/PriceSlider";
import { QualityDisplay } from "./product/QualityDisplay";

export function Sidebar({ isOpen, onClose }) {
  const setPriceFilter = useProductStore((state) => state.setPriceFilter);
  const setCategoryFilter = useProductStore((state) => state.setCategoryFilter);
  const setQualityFilter = useProductStore((state) => state.setQualityFilter);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [range, setRange] = useState([0, 1000]);
  const [selectedQuality, setSelectedQuality] = useState("--");

  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePriceChange = (value) => {
    setRange(value);
  };

  const applyFilters = () => {
    if (selectedCategoryId) {
      setCategoryFilter(selectedCategoryId);
    } else {
      setCategoryFilter("all");
    }
    setPriceFilter(range);
    setQualityFilter(selectedQuality);
    onClose();
  };

  const clearFilters = () => {
    setSelectedCategory("Todas");
    setSelectedCategoryId(null);
    setRange([0, 1000]);
    setCategoryFilter("all");
    setPriceFilter([0, 1000]);
    setSelectedQuality("--");
    setQualityFilter("--");
  };

  const organizeCategories = (categories) => {
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, subcategories: [] };
    });
    const rootCategories = [];
    categories.forEach((category) => {
      if (category.parentCategoryId) {
        categoryMap[category.parentCategoryId].subcategories.push(
          categoryMap[category.id],
        );
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });
    return rootCategories;
  };

  const handleCategorySelect = (id, name) => {
    setSelectedCategoryId(id);
    setSelectedCategory(name);
    setIsDropdownOpen(false);
  };

  const handleQualitySelect = (quality) => {
    setSelectedQuality(quality);
  };

  const renderCategories = (categories) => {
    return (
      <ul
        className="bg-white border rounded-lg absolute transition duration-200 origin-top min-w-32 z-40"
        onClick={(e) => e.stopPropagation()}
      >
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative px-3 py-1 hover:bg-gray-100"
            onClick={(event) => {
              event.stopPropagation();
              handleCategorySelect(category.id, category.name);
            }}
          >
            <button className="w-full text-left flex items-center outline-none focus:outline-none">
              <span className="pr-1 flex-1">{category.name}</span>
              {category.subcategories.length > 0 && (
                <svg
                  className="fill-current h-4 w-4 transform transition duration-150"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              )}
            </button>
            {category.subcategories.length > 0 && (
              <ul className="bg-white border rounded-sm absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32 z-40">
                {category.subcategories.map((subcategory) => (
                  <li
                    key={subcategory.id}
                    className="relative px-3 py-1 hover:bg-gray-100"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCategorySelect(subcategory.id, subcategory.name);
                    }}
                  >
                    <button className="w-full text-left flex items-center outline-none focus:outline-none">
                      <span className="pr-1 flex-1">{subcategory.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const organizedCategories = organizeCategories(categories);

  return (
    <div
      className={`fixed top-0 left-0 h-full p-6 transition-transform transform bg-gray-200 ${
        isOpen ? "translate-x-0 border border-gray-400" : "-translate-x-full"
      } z-50 flex flex-col justify-between`}
      style={{ width: "300px" }}
    >
      <div>
        <h2 className="mt-2 text-xl font-semibold">Filtrar por</h2>
        <div className="group inline-block relative mt-20 w-full">
          <h3 className="text-md">Categoría</h3>
          <button
            className="flex mt-4 w-full items-center justify-between outline-none focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-3"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedCategory}</span>
            <span>
              <svg
                className="fill-current h-4 w-4 transform group-hover:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </span>
          </button>
          {isDropdownOpen && renderCategories(organizedCategories)}
        </div>

        <div className="group inline-block relative mt-10 w-full">
          <h3 className="text-md mb-4">Estado</h3>
          <QualityDisplay onQualitySelect={handleQualitySelect} />
        </div>

        <div className="group inline-block relative mt-10 w-full">
          <h3 className="text-md mb-4">Precio</h3>
          <PriceSlider value={range} onValueChange={handlePriceChange} />
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          className="w-full bg-accent-darker text-white font-bold py-2 rounded hover:opacity-80 transition duration-200"
          onClick={applyFilters}
        >
          Aplicar filtros
        </button>
        <button
          className="w-full text-red-400 font-bold  py-2 border border-red-400 rounded hover:bg-red-50 transition-all"
          onClick={clearFilters}
        >
          Quitar filtros
        </button>
      </div>
    </div>
  );
}
