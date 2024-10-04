import React, { useState, useEffect } from "react";
import { useCategoryStore } from "../store/useCategoryStore";
import "./CategoryDisplay.css";

export const CategoryDisplay = ({ onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("--");

  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const handleCategoryClick = (event, category) => {
    event.preventDefault();
    if (category.subcategories.length === 0) {
      setSelectedCategory(category.name);
      onCategorySelect(category);
      setIsOpen(false);
    }
  };

  const renderCategories = (categories) => {
    return (
      <ul
        className="bg-white border rounded-lg transform scale-0 group-hover:scale-100 absolute transition duration-200 origin-top min-w-32"
        onClick={(e) => e.stopPropagation()}
      >
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative px-3 py-1 hover:bg-gray-100"
            onClick={(event) => {
              event.stopPropagation();
              handleCategoryClick(event, category);
            }}
          >
            <button className="w-full text-left flex items-center outline-none focus:outline-none">
              <span className="pr-1 flex-1">{category.name}</span>
              {category.subcategories.length > 0 && (
                <span className="mr-auto">
                  <svg
                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </span>
              )}
            </button>
            {category.subcategories.length > 0 && (
              <ul className="bg-white border rounded-sm absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32">
                {renderCategories(category.subcategories)}
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
    <div className="group inline-block relative">
      <button
        className="flex items-center justify-between outline-none focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="">{selectedCategory}</span>
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
      {isOpen && renderCategories(organizedCategories)}
    </div>
  );
};
